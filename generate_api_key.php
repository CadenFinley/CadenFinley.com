<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

header('Content-Type: application/json');

try {
    $has_permissions = isset($_REQUEST['permissions']) ? (int)$_REQUEST['permissions'] : 0;
    $provided_universal_key = isset($_REQUEST['universal_key']) ? $_REQUEST['universal_key'] : '';
    $description = isset($_REQUEST['description']) && !empty($_REQUEST['description']) ? $_REQUEST['description'] : 'No information';
    $expires_days = isset($_REQUEST['expires_days']) ? (int)$_REQUEST['expires_days'] : 0;

    if ($has_permissions == 1 && isset($_REQUEST['permissions'])) {
        if (!isset($universal_key) || $provided_universal_key !== $universal_key) {
            echo json_encode([
                'status' => 'error',
                'code' => 'AUTH_FAILED',
                'message' => 'Authentication failed: The provided universal key is invalid or missing. Admin API keys require proper authentication.'
            ]);
            exit;
        }
    }

    if (!isset($servername) || !isset($username) || !isset($password)) {
        throw new Exception("Database configuration variables are missing in config.php");
    }

    $conn = new mysqli($servername, $username, $password, "Valid_Api_Keys");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }

    $random_suffix = substr(bin2hex(random_bytes(10)), 0, 10);
    $permission_type = $has_permissions ? "1" : "0";

    $api_key = "dtt_{$permission_type}_{$random_suffix}";

    $expires_at = null;
    if ($has_permissions == 1) {
        // Admin keys never expire
        $expires_at = null;
    } else if ($expires_days > 0) {
        $expires_at = date('Y-m-d H:i:s', strtotime("+$expires_days days"));
    } else {
        $expires_at = date('Y-m-d H:i:s', strtotime("+7 days"));
    }

    $check_stmt = $conn->prepare("SELECT COUNT(*) FROM `api_keys` WHERE `key` = ?");
    if (!$check_stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    
    $check_stmt->bind_param("s", $api_key);
    $check_stmt->execute();
    $check_stmt->bind_result($key_count);
    $check_stmt->fetch();
    $check_stmt->close();
    
    if ($key_count > 0) {
        throw new Exception("Generated key already exists. Please try again.");
    }

    $max_id_result = $conn->query("SELECT MAX(id) as max_id FROM `api_keys`");
    if (!$max_id_result) {
        throw new Exception("Failed to query maximum ID: " . $conn->error);
    }
    
    $row = $max_id_result->fetch_assoc();
    $next_id = ($row['max_id'] === null) ? 1 : $row['max_id'] + 1;
    $max_id_result->free();

    $stmt = $conn->prepare("INSERT INTO `api_keys` (id, permissions, `key`, description, expires_at) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }

    $stmt->bind_param("iisss", $next_id, $has_permissions, $api_key, $description, $expires_at);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'api_key' => $api_key,
            'permissions' => $has_permissions ? 'admin' : 'standard',
            'description' => $description,
            'expires_at' => $expires_at
        ]);
    } else {
        throw new Exception("Failed to store API key: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    error_log("API Key Generation Error: " . $e->getMessage());
    
    echo json_encode([
        'status' => 'error',
        'code' => 'SYSTEM_ERROR',
        'message' => 'An error occurred while generating the API key.',
        'details' => $e->getMessage()
    ]);
}
?>
