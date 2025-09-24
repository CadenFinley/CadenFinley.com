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

if (empty($username)) {
    echo json_encode(['success' => false, 'message' => 'Username is required.']);
    exit();
}

$sql = "SELECT messages_sent_24h FROM user_info WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found.']);
    exit();
}

$row = $result->fetch_assoc();
$messages_sent_24h = $row['messages_sent_24h'];

if ($messages_sent_24h >= 10) {
    echo json_encode(['success' => true, 'canSend' => false]);
} else {
    echo json_encode(['success' => true, 'canSend' => true]);
}

$conn->close();
?>
