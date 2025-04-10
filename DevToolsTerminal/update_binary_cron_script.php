<?php
if (php_sapi_name() !== 'cli') {
    header('HTTP/1.0 403 Forbidden');
    echo "Access denied.";
    exit(1);
}

$owner = 'CadenFinley';
$repo = 'DevToolsTerminal';

$scriptDir = dirname(__FILE__);
$binaryDir = $scriptDir . '/';
$logFile = $scriptDir . '/update_log.txt';
$versionFilePath = $scriptDir . '/version.txt';

$log = "[" . date('Y-m-d H:i:s') . "] Starting binary update process\n";
$log .= "Script running from: {$scriptDir}\n";

try {
    $currentVersion = '';
    if (file_exists($versionFilePath)) {
        $currentVersion = trim(file_get_contents($versionFilePath));
        $log .= "Current installed version: {$currentVersion}\n";
    } else {
        $log .= "No existing version found. Will install the latest version.\n";
    }

    $apiUrl = "https://api.github.com/repos/{$owner}/{$repo}/releases/latest";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'DevToolsTerminal Update Script');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/vnd.github.v3+json']);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception('Curl error: ' . curl_error($ch));
    }
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode !== 200) {
        throw new Exception("HTTP error: {$httpCode}, Response: {$response}");
    }
    
    curl_close($ch);
    
    $release = json_decode($response, true);
    if (!$release || !isset($release['assets']) || empty($release['assets'])) {
        throw new Exception('No valid release assets found');
    }
    
    $versionNumber = $release['tag_name'];
    $log .= "Latest available version: {$versionNumber}\n";
    
    if (!empty($currentVersion) && version_compare($currentVersion, $versionNumber, '>=')) {
        $log .= "Current version is up to date. No update needed.\n";
        file_put_contents($logFile, $log, FILE_APPEND);
        echo $log;
        exit(0);
    }
    
    $log .= "Update required. Proceeding with download...\n";
    
    $binaryAsset = null;
    foreach ($release['assets'] as $asset) {
        if (strpos($asset['name'], '.bin') !== false || strpos($asset['name'], 'DevToolsTerminal') !== false) {
            $binaryAsset = $asset;
            break;
        }
    }
    
    if (!$binaryAsset) {
        throw new Exception('Binary asset not found in the latest release');
    }
    
    $downloadUrl = $binaryAsset['browser_download_url'];
    $binaryName = $binaryAsset['name'];
    $binaryPath = $binaryDir . $binaryName;
    
    if (!file_exists($binaryDir)) {
        if (!@mkdir($binaryDir, 0755, true)) {
            throw new Exception("Failed to create directory: {$binaryDir}. Please check permissions.");
        }
        $log .= "Created binary directory: {$binaryDir}\n";
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $downloadUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $binaryData = curl_exec($ch);
    
    if (curl_errno($ch)) {
        throw new Exception('Download error: ' . curl_error($ch));
    }
    
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode !== 200) {
        throw new Exception("HTTP error when downloading binary: {$httpCode}");
    }
    
    curl_close($ch);
    
    if (file_put_contents($binaryPath, $binaryData) === false) {
        throw new Exception("Failed to save binary to {$binaryPath}. Check write permissions.");
    }
    
    @chmod($binaryPath, 0755);
    
    $latestSymlink = $binaryDir . 'latest';
    @unlink($latestSymlink);
    @symlink($binaryPath, $latestSymlink);
    
    if (file_put_contents($versionFilePath, $versionNumber) === false) {
        throw new Exception("Failed to save version information to {$versionFilePath}");
    }
    
    $log .= "Successfully downloaded and installed binary: {$binaryName}\n";
    $log .= "Updated from version {$currentVersion} to {$versionNumber}\n";
    $log .= "Version information saved to: {$versionFilePath}\n";
    $log .= "Binary stored at: {$binaryPath}\n";
    $log .= "cPanel execution completed successfully\n";
} catch (Exception $e) {
    $log .= "ERROR: " . $e->getMessage() . "\n";
    $log .= "Error occurred during cPanel cron execution\n";
}

file_put_contents($logFile, $log, FILE_APPEND);
echo $log;
?>
