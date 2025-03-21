<?php
header('Content-Type: application/json');

$dbname = "User_Data";
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$sql = "UPDATE user_info SET messages_sent_24h = 0";
if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Message count reset successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error resetting message count: ' . $conn->error]);
}

$conn->close();
?>
