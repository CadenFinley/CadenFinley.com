<?php
header('Content-Type: application/json');

session_start();
if (!isset($_SESSION['adminName']) || $_SESSION['adminName'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
    exit();
}

$dbname = "User_Data";
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['username'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    exit();
}

$username = $data['username'];

$sql = "DELETE FROM user_info WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param("s", $username);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error deleting user: ' . $stmt->error]);
}

$conn->close();
?>
