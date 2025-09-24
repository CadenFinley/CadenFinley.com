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

$sql = "SELECT * FROM user_chats WHERE sender_user = ? OR receiver_user = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

$chatInstances = [];
while ($row = $result->fetch_assoc()) {
    $chatInstances[] = $row;
}

if (!empty($chatInstances)) {
    echo json_encode(['success' => true, 'chatInstances' => $chatInstances]);
} else {
    echo json_encode(['success' => false, 'message' => 'No chat instances found for this user.']);
}

$conn->close();
?>
