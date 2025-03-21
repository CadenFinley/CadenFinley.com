<?php
header('Content-Type: application/json');

require 'config.php';

$conn = new mysqli($servername, $username, $password, "User_Data");

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;
$receiver = $data['receiver'] ?? null;

if (empty($username) || empty($receiver)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$sql = "SELECT sender_user, sent_history FROM user_chats WHERE (sender_user = ? AND receiver_user = ?) OR (sender_user = ? AND receiver_user = ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $username, $receiver, $receiver, $username);
$stmt->execute();
$result = $stmt->get_result();

$chatHistory = [];
while ($row = $result->fetch_assoc()) {
    $history = json_decode($row['sent_history'], true);
    foreach ($history as $message) {
        $message['sender'] = $row['sender_user'];
        $chatHistory[] = $message;
    }
}

if (!empty($chatHistory)) {
    usort($chatHistory, function($a, $b) {
        return strtotime($a['timestamp']) - strtotime($b['timestamp']);
    });
    echo json_encode(['success' => true, 'chatHistory' => $chatHistory]);
} else {
    echo json_encode(['success' => false, 'message' => 'No chat history found for this user.']);
}

$conn->close();
?>
