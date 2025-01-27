<?php
header('Content-Type: application/json');

$dbname = "Site_Stats";
require 'config.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sql = "UPDATE stats SET visits = visits + 1";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Visits incremented successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating record: ' . $conn->error]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT visits FROM stats";
    $result = $conn->query($sql);
    if ($result) {
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode(['success' => true, 'visits' => $row['visits']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No data found']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error retrieving data: ' . $conn->error]);
    }
}

$conn->close();
?>
