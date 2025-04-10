<?php
$binaryDir = __DIR__ . '/';

$requestedPlatform = isset($_GET['platform']) ? $_GET['platform'] : 'macos';
$requestedVersion = isset($_GET['version']) ? $_GET['version'] : null;

$currentVersion = null;
$versionFile = $binaryDir . 'version.txt';
if (file_exists($versionFile)) {
    $currentVersion = trim(file_get_contents($versionFile));
}

if ($requestedVersion === null) {
    $requestedVersion = $currentVersion;
}

$binaryFilename = 'DevToolsTerminal';

if (in_array($requestedPlatform, ['macos', 'windows', 'linux'])) {
    switch ($requestedPlatform) {
        case 'windows':
            $binaryFilename = 'DevToolsTerminal.exe';
            break;
        case 'linux':
        case 'macos':
            $binaryFilename = 'DevToolsTerminal';
            break;
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid platform specified']);
    exit;
}

$downloadPath = $binaryDir . $binaryFilename;

if ($requestedVersion !== null && $requestedVersion !== $currentVersion) {
    $githubReleaseUrl = "https://github.com/Cadenfinley/devtoolsterminal/releases/tag/{$requestedVersion}";
    
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'error',
        'message' => "Version mismatch. Requested version ($requestedVersion) doesn't match available version" . 
                     ($currentVersion !== null ? " ($currentVersion)" : ""),
        'githubUrl' => $githubReleaseUrl
    ]);
    exit;
}

if (!file_exists($downloadPath)) {
    header('HTTP/1.1 404 Not Found');
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Binary file not found']);
    exit;
}

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $binaryFilename . '"');
header('Content-Length: ' . filesize($downloadPath));
header('Pragma: public');

ob_clean();
flush();

readfile($downloadPath);
exit;
?>
