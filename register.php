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
$password = $data['password'] ?? null;

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    exit();
}

$disallowed_usernames = ['admin', 'root', 'superuser', 'caden', 'cadenfinley'];
if (in_array(strtolower($username), $disallowed_usernames) || preg_match('/\s/', $username)) {
    echo json_encode(['success' => false, 'message' => 'This username is not allowed.']);
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

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
    exit();
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO user_info (username, password, lastlogin, messages_sent, messages_sent_24h) VALUES (?, ?, NOW(), 0, 0)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    exit();
}
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error creating account: ' . $stmt->error]);
}

$conn->close();
?>
