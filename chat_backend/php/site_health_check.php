<?php
/**
 * Website Health Check Script
 * This script checks various aspects of website health and returns data as JSON
 * Set up as a daily cron job in cPanel
 * Requires admin API key for authentication
 */

// Include configuration file
require_once 'config.php';

// Set headers for JSON output
header('Content-Type: application/json');

// Check if API key is provided
if (!isset($_REQUEST['api_key']) || empty($_REQUEST['api_key'])) {
    echo json_encode([
        'status' => 'error',
        'code' => 'AUTH_REQUIRED',
        'message' => 'Authentication required: Please provide a valid API key'
    ]);
    exit;
}

$api_key = $_REQUEST['api_key'];

// Validate API key has admin permissions
$validationResult = validateApiKey($api_key);
if (!$validationResult['valid']) {
    echo json_encode([
        'status' => 'error',
        'code' => $validationResult['code'],
        'message' => $validationResult['message']
    ]);
    exit;
}

// Initialize the health data array
$healthData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => [],
    'php' => [],
    'database' => [],
    'website' => [],
    'disk' => [],
    'ssl' => []
];

// Check server information
$healthData['server'] = [
    'hostname' => gethostname(),
    'ip' => $_SERVER['SERVER_ADDR'] ?? 'unknown',
    'os' => php_uname('s') . ' ' . php_uname('r'),
    'uptime' => getServerUptime(),
    'load_average' => getServerLoadAverage()
];

// Check PHP information
$healthData['php'] = [
    'version' => phpversion(),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
    'memory_usage' => formatBytes(memory_get_usage(true)),
    'extensions' => getLoadedExtensions()
];

// Check database connection
$healthData['database'] = checkDatabaseConnection();

// Check website response
$healthData['website'] = [
    'homepage' => checkPageResponse('https://cadenfinley.com'),
    'response_time' => getAverageResponseTime('https://cadenfinley.com', 3)
];

// Check disk space
$healthData['disk'] = [
    'total' => formatBytes(disk_total_space('.')),
    'free' => formatBytes(disk_free_space('.')),
    'used' => formatBytes(disk_total_space('.') - disk_free_space('.')),
    'usage_percent' => round((1 - disk_free_space('.') / disk_total_space('.')) * 100, 2) . '%'
];

// Check SSL certificate
$healthData['ssl'] = checkSSLCertificate('cadenfinley.com');

// Log the health check to a file
logHealthCheck($healthData);

// Output the JSON result
echo json_encode($healthData, JSON_PRETTY_PRINT);
exit;

/**
 * Helper functions
 */

/**
 * Validates API key against the database
 * 
 * @param string $api_key The API key to validate
 * @return array Validation result with status and error details
 */
function validateApiKey($api_key) {
    global $servername, $username, $password;
    
    try {
        $conn = new mysqli($servername, $username, $password, "Valid_Api_Keys");
        
        if ($conn->connect_error) {
            error_log("Database connection failed: " . $conn->connect_error);
            return [
                'valid' => false,
                'code' => 'DB_CONNECTION_ERROR',
                'message' => 'Authentication failed: Database connection error'
            ];
        }
        
        $stmt = $conn->prepare("SELECT permissions FROM api_keys WHERE `key` = ? AND (expires_at IS NULL OR expires_at > NOW())");
        if (!$stmt) {
            error_log("Database prepare failed: " . $conn->error);
            return [
                'valid' => false,
                'code' => 'DB_QUERY_ERROR',
                'message' => 'Authentication failed: Database query error'
            ];
        }
        
        $stmt->bind_param("s", $api_key);
        $stmt->execute();
        $stmt->bind_result($permissions);
        $found = $stmt->fetch();
        $stmt->close();
        
        // Check if API key exists
        if (!$found) {
            // Check if key exists but is expired
            $expiredCheck = $conn->prepare("SELECT 1 FROM api_keys WHERE `key` = ? AND expires_at <= NOW()");
            if ($expiredCheck) {
                $expiredCheck->bind_param("s", $api_key);
                $expiredCheck->execute();
                $expiredCheck->store_result();
                $isExpired = $expiredCheck->num_rows > 0;
                $expiredCheck->close();
                
                if ($isExpired) {
                    $conn->close();
                    return [
                        'valid' => false,
                        'code' => 'API_KEY_EXPIRED',
                        'message' => 'Authentication failed: API key has expired'
                    ];
                }
            }
            
            $conn->close();
            return [
                'valid' => false,
                'code' => 'API_KEY_INVALID',
                'message' => 'Authentication failed: API key not found'
            ];
        }
        
        // Check if key has admin permissions
        if ($permissions != 1) {
            $conn->close();
            return [
                'valid' => false,
                'code' => 'INSUFFICIENT_PERMISSIONS',
                'message' => 'Authentication failed: API key lacks admin permissions'
            ];
        }
        
        $conn->close();
        return [
            'valid' => true,
            'code' => 'AUTH_SUCCESS',
            'message' => 'Authentication successful'
        ];
    } catch (Exception $e) {
        error_log("API Key validation error: " . $e->getMessage());
        return [
            'valid' => false,
            'code' => 'VALIDATION_EXCEPTION',
            'message' => 'Authentication failed: ' . $e->getMessage()
        ];
    }
}

function getServerUptime() {
    $uptime = shell_exec('uptime');
    return $uptime ? trim($uptime) : 'Unknown';
}

function getServerLoadAverage() {
    if (function_exists('sys_getloadavg')) {
        $load = sys_getloadavg();
        return [
            '1min' => $load[0],
            '5min' => $load[1],
            '15min' => $load[2]
        ];
    }
    return 'Not available';
}

function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    
    $bytes /= pow(1024, $pow);
    
    return round($bytes, $precision) . ' ' . $units[$pow];
}

function checkDatabaseConnection() {
    // Use database credentials from config file
    global $servername, $username, $password;
    $dbHost = $servername;
    $dbUser = $username;
    $dbPass = $password;
    $dbName = "Valid_Api_Keys"; // Using an existing database
    
    $startTime = microtime(true);
    
    try {
        $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Get MySQL version
        $stmt = $pdo->query("SELECT VERSION() as version");
        $mysqlVersion = $stmt->fetch(PDO::FETCH_ASSOC)['version'];
        
        // Check connection time
        $connectionTime = round((microtime(true) - $startTime) * 1000, 2);
        
        return [
            'status' => 'connected',
            'version' => $mysqlVersion,
            'connection_time_ms' => $connectionTime,
            'error' => null
        ];
    } catch (PDOException $e) {
        return [
            'status' => 'error',
            'version' => null,
            'connection_time_ms' => null,
            'error' => $e->getMessage()
        ];
    }
}

function checkPageResponse($url) {
    $startTime = microtime(true);
    $headers = get_headers($url, 1);
    $endTime = microtime(true);
    
    $responseTime = round(($endTime - $startTime) * 1000, 2);
    
    if ($headers) {
        $statusCode = intval(substr($headers[0], 9, 3));
        return [
            'url' => $url,
            'status_code' => $statusCode,
            'status' => ($statusCode >= 200 && $statusCode < 400) ? 'ok' : 'error',
            'response_time_ms' => $responseTime
        ];
    }
    
    return [
        'url' => $url,
        'status_code' => null,
        'status' => 'error',
        'response_time_ms' => null
    ];
}

function getAverageResponseTime($url, $attempts = 3) {
    $times = [];
    
    for ($i = 0; $i < $attempts; $i++) {
        $start = microtime(true);
        $headers = get_headers($url, 1);
        $end = microtime(true);
        
        if ($headers) {
            $times[] = ($end - $start) * 1000; // Convert to ms
        }
        
        // Brief pause between requests
        usleep(100000); // 100ms
    }
    
    if (count($times) > 0) {
        return [
            'average_ms' => round(array_sum($times) / count($times), 2),
            'min_ms' => round(min($times), 2),
            'max_ms' => round(max($times), 2)
        ];
    }
    
    return [
        'average_ms' => null,
        'min_ms' => null,
        'max_ms' => null
    ];
}

function checkSSLCertificate($domain) {
    $result = [
        'valid' => false,
        'expiration' => null,
        'days_remaining' => null,
        'issuer' => null,
        'error' => null
    ];
    
    try {
        $context = stream_context_create(['ssl' => ['capture_peer_cert' => true]]);
        $stream = @stream_socket_client(
            "ssl://$domain:443", 
            $errno, 
            $errstr, 
            30, 
            STREAM_CLIENT_CONNECT, 
            $context
        );
        
        if ($stream) {
            $params = stream_context_get_params($stream);
            $cert = openssl_x509_parse($params['options']['ssl']['peer_certificate']);
            
            if ($cert) {
                $validTo = $cert['validTo_time_t'];
                $daysRemaining = ceil(($validTo - time()) / 86400);
                
                $result['valid'] = true;
                $result['expiration'] = date('Y-m-d H:i:s', $validTo);
                $result['days_remaining'] = $daysRemaining;
                $result['issuer'] = $cert['issuer']['CN'] ?? 'Unknown';
            }
            
            fclose($stream);
        } else {
            $result['error'] = "Could not connect to $domain:443";
        }
    } catch (Exception $e) {
        $result['error'] = $e->getMessage();
    }
    
    return $result;
}

function logHealthCheck($data) {
    $logDir = __DIR__ . '/logs';
    
    // Create logs directory if it doesn't exist
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logFile = $logDir . '/health_check_' . date('Y-m-d') . '.log';
    
    // Append the data to the log file
    file_put_contents(
        $logFile,
        date('Y-m-d H:i:s') . " - Health Check Executed\n" .
        json_encode($data, JSON_PRETTY_PRINT) . "\n\n",
        FILE_APPEND
    );
}

/**
 * Gets a list of loaded PHP extensions
 * 
 * @return array List of loaded PHP extensions
 */
function getLoadedExtensions() {
    $extensions = get_loaded_extensions();
    
    // Optionally filter or process the extensions list
    // For example, you might want to include only specific critical extensions
    $criticalExtensions = ['mysqli', 'pdo', 'curl', 'openssl', 'gd', 'mbstring', 'json', 'xml'];
    
    $result = [];
    foreach ($criticalExtensions as $ext) {
        $result[$ext] = in_array($ext, $extensions);
    }
    
    return $result;
}
?>
