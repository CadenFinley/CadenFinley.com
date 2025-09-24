<?php
function testOpenAIConnection($apiKey) {
    $url = 'https://api.openai.com/v1/models';
    
    $options = [
        'http' => [
            'header'  => "Authorization: Bearer $apiKey\r\n",
            'method'  => 'GET',
            'timeout' => 10
        ]
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        return ['success' => false, 'message' => 'Failed to connect to OpenAI API.'];
    }

    $response = json_decode($result, true);

    if (isset($response['data'])) {
        return ['success' => true, 'message' => 'Successfully connected to OpenAI API.'];
    } else {
        return ['success' => false, 'message' => 'Failed to retrieve data from OpenAI API.'];
    }
}

$apiKey = 'you wish lol';
$response = testOpenAIConnection($apiKey);
echo json_encode($response);
?>
