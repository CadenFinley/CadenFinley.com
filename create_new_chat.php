<?php
header('Content-Type: application/json');

require 'config.php';

$conn = new mysqli($servername, $username, $password, "User_Data");

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Invalid JSON input: ' . json_last_error_msg());
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    $conn->close();
    exit();
}

$sender = $data['sender'] ?? null;
$receiver = $data['receiver'] ?? null;

if (empty($sender) || empty($receiver)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    $conn->close();
    exit();
}

$sql = "INSERT INTO user_chats (sender_user, receiver_user, sent_history) VALUES (?, ?, ?), (?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('SQL prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    $conn->close();
    exit();
}
$empty_history = json_encode([]);
$stmt->bind_param("ssssss", $sender, $receiver, $empty_history, $receiver, $sender, $empty_history);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'New chat created successfully.']);
} else {
    error_log('Error creating new chat: ' . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Error creating new chat: ' . $stmt->error]);
}

$conn->close();
?>
