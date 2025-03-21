<?php
session_start();
header('Content-Type: application/json');

$dbname = "User_Data";
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$username = $data['username'] ?? null;

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username is required.']);
    exit();
}

$conn->begin_transaction();

try {
    $sql = "DELETE FROM user_info WHERE username = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('SQL prepare failed: ' . $conn->error);
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();

    if ($stmt->affected_rows === 0) {
        throw new Exception('User not found.');
    }

    $sql = "DELETE FROM user_chats WHERE sender_user = ? OR receiver_user = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('SQL prepare failed: ' . $conn->error);
    }
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'User and their chats deleted successfully.']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
