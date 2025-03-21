<?php
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
$isAIQuery = $data['isAIQuery'] ?? false;

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username is required.']);
    exit();
}

if ($isAIQuery) {
    $sql = "UPDATE user_info SET messages_sent = messages_sent + 1, messages_sent_24h = messages_sent_24h + 1 WHERE username = ?";
} else {
    $sql = "UPDATE user_info SET messages_sent = messages_sent + 1 WHERE username = ?";
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param("s", $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Message count incremented successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error incrementing message count: ' . $stmt->error]);
}

$conn->close();
?>
