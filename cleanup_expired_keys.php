<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

define('SCRIPT_EXECUTION', true);

require_once 'config.php';

$log_file = __DIR__ . '/api_key_cleanup.log';

function log_message($message) {
    global $log_file;
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] $message" . PHP_EOL;
    
    file_put_contents($log_file, $log_entry, FILE_APPEND);
    
    if (php_sapi_name() === 'cli') {
        echo $log_entry;
    }
}

if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json');
    
    $provided_universal_key = isset($_REQUEST['universal_key']) ? $_REQUEST['universal_key'] : '';
    
    if (!isset($universal_key) || $provided_universal_key !== $universal_key) {
        echo json_encode([
            'status' => 'error',
            'code' => 'AUTH_FAILED',
            'message' => 'Authentication failed: This script requires proper authentication.'
        ]);
        exit;
    }
}

try {
    if (!isset($servername) || !isset($username) || !isset($password)) {
        throw new Exception("Database configuration variables are missing in config.php");
    }

    $conn = new mysqli($servername, $username, $password, "Valid_Api_Keys");

    if ($conn->connect_error) {
        throw new Exception("Database connection failed: " . $conn->connect_error);
    }
    
    log_message("Connected to database. Beginning cleanup of expired API keys.");
    $current_date = date('Y-m-d H:i:s');
    $count_stmt = $conn->prepare("SELECT COUNT(*) FROM `api_keys` WHERE `expires_at` < ?");
    if (!$count_stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    
    $count_stmt->bind_param("s", $current_date);
    $count_stmt->execute();
    $count_stmt->bind_result($expired_count);
    $count_stmt->fetch();
    $count_stmt->close();
    
    log_message("Found $expired_count expired API keys to delete.");
    
    $delete_stmt = $conn->prepare("DELETE FROM `api_keys` WHERE `expires_at` < ?");
    if (!$delete_stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    
    $delete_stmt->bind_param("s", $current_date);
    $success = $delete_stmt->execute();
    $rows_affected = $delete_stmt->affected_rows;
    $delete_stmt->close();
    
    if ($success) {
        log_message("Successfully deleted $rows_affected expired API keys.");
        
        $result = [
            'status' => 'success',
            'timestamp' => $current_date,
            'keys_deleted' => $rows_affected
        ];
    } else {
        throw new Exception("Failed to delete expired keys: " . $conn->error);
    }
    
    $conn->close();

    if (php_sapi_name() !== 'cli') {
        echo json_encode($result);
    }
    
    log_message("Cleanup operation completed successfully.");
    
} catch (Exception $e) {
    log_message("ERROR: " . $e->getMessage());
    
    if (php_sapi_name() !== 'cli') {
        echo json_encode([
            'status' => 'error',
            'code' => 'SYSTEM_ERROR',
            'message' => 'An error occurred while cleaning up API keys.',
            'details' => $e->getMessage()
        ]);
    }
}
?>
```
