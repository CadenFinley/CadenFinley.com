<?php
header('Content-Type: application/json');

$versionFile = __DIR__ . '/version.txt';

$latestVersion = "0.0.0.0";

if (file_exists($versionFile)) {
    $fileVersion = trim(file_get_contents($versionFile));
    if (!empty($fileVersion)) {
        $latestVersion = $fileVersion;
    }
}

echo json_encode([
    'version' => $latestVersion,
    'status' => 'success'
]);
?>
