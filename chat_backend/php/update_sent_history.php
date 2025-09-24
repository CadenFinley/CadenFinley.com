<?php
header('Content-Type: application/json');

require 'config.php';

$conn = new mysqli($servername, $username, $password, "User_Data");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$sender = $data['sender'] ?? null;
$receiver = $data['receiver'] ?? null;
$message = $data['message'] ?? null;
$timestamp = $data['timestamp'] ?? null;

if (empty($sender) || empty($receiver) || empty($message) || empty($timestamp)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$sql = "SELECT sent_history FROM user_chats WHERE sender_user = ? AND receiver_user = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $sender, $receiver);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $sent_history = json_decode($row['sent_history'], true);
    $sent_history[] = ['message' => $message, 'timestamp' => $timestamp];

    $updated_history = json_encode($sent_history);
    $update_sql = "UPDATE user_chats SET sent_history = ? WHERE sender_user = ? AND receiver_user = ?";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bind_param("sss", $updated_history, $sender, $receiver);

    if ($update_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Sent history updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating sent history: ' . $update_stmt->error]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No chat history found for this user.']);
}

$conn->close();
?>
