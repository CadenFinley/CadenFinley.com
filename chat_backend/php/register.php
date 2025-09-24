<?php
header('Content-Type: application/json');

$dbname = "User_Data";
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    error_log('Database connection failed: ' . $conn->connect_error);
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
    $conn->close();
    exit();
}

$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required.']);
    $conn->close();
    exit();
}

$disallowed_usernames = ['admin', 'root', 'superuser', 'caden', 'cadenfinley'];
if (in_array(strtolower($username), $disallowed_usernames) || preg_match('/\s/', $username)) {
    echo json_encode(['success' => false, 'message' => 'This username is not allowed.']);
    $conn->close();
    exit();
}

$sql = "SELECT * FROM user_info WHERE username = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('SQL prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    $conn->close();
    exit();
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Username already exists.']);
    $conn->close();
    exit();
}

$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$sql = "INSERT INTO user_info (username, password, lastlogin, messages_sent, messages_sent_24h) VALUES (?, ?, NOW(), 0, 0)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    error_log('SQL prepare failed: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
    $conn->close();
    exit();
}
$stmt->bind_param("ss", $username, $hashed_password);

if ($stmt->execute()) {
    $sql_chat = "INSERT INTO user_chats (sender_user, receiver_user, sent_history) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?), (?, ?, ?)";
    $stmt_chat = $conn->prepare($sql_chat);
    if (!$stmt_chat) {
        error_log('SQL prepare failed: ' . $conn->error);
        echo json_encode(['success' => false, 'message' => 'SQL prepare failed: ' . $conn->error]);
        $conn->close();
        exit();
    }
    $ai_user = 'ai';
    $admin_user = 'admin';
    $empty_history = json_encode([]); // Initialize sent_history as an empty array

    $stmt_chat->bind_param("ssssssssssss", $username, $ai_user, $empty_history, $ai_user, $username, $empty_history, $username, $admin_user, $empty_history, $admin_user, $username, $empty_history);
    
    if ($stmt_chat->execute()) {
        echo json_encode(['success' => true, 'message' => 'Account created successfully!']);
    } else {
        error_log('Error creating chat records: ' . $stmt_chat->error);
        echo json_encode(['success' => false, 'message' => 'Error creating chat records: ' . $stmt_chat->error]);
    }
} else {
    error_log('Error creating account: ' . $stmt->error);
    echo json_encode(['success' => false, 'message' => 'Error creating account: ' . $stmt->error]);
}

$conn->close();
?>
