<?php
header('Content-Type: application/json');

require 'config.php';

$conn = new mysqli($servername, $username, $password, "User_Data");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$empty_history = json_encode([]);

$sql = "UPDATE user_chats SET sent_history = ? WHERE (sender_user = ? AND receiver_user = 'ai') OR (sender_user = 'ai' AND receiver_user = ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $empty_history, $username, $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Chat history cleared successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error clearing chat history: ' . $stmt->error]);
}

$conn->close();
?>
