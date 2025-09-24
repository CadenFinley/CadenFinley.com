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
$password = $data['password'] ?? null;

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

$sql = "SELECT * FROM user_info WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    exit();
}

$user = $result->fetch_assoc();
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid username or password.']);
    exit();
}

$_SESSION['username'] = $username;
session_write_close();

if ($username === 'admin') {
    echo json_encode(['success' => true, 'message' => 'Login successful!', 'redirect' => '/admin']);
} else {
    echo json_encode(['success' => true, 'message' => 'Login successful!', 'redirect' => '/chat']);
}

$conn->close();
?>
