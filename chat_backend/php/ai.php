<?php
function filterMessage($message) {
    return preg_replace('/[^a-zA-Z0-9\s\-_~]/', '', str_replace("\n", " ", $message));
}

function chatGPT($message, $usingChatCache, $chatCache) {
    $apiKey = 'you wish lol';
    $url = 'https://api.openai.com/v1/chat/completions';
    $model = 'gpt-4o-mini';

    if ($usingChatCache && !empty($chatCache)) {
        $sentMessage = "These are the previous messages from this conversation: '" . implode(", ", $chatCache) . "' This is the user's response based on the previous conversation: '" . $message . "'";
    } else {
        $sentMessage = $message;
    }

    $sentMessage = filterMessage($sentMessage);

    $data = [
        'model' => $model,
        'messages' => [
            ['role' => 'user', 'content' => $sentMessage]
        ]
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/json\r\nAuthorization: Bearer $apiKey\r\n",
            'method'  => 'POST',
            'content' => json_encode($data),
            'timeout' => 10
        ]
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        return ['success' => false, 'message' => 'An error occurred while communicating with the AI.'];
    }

    $response = json_decode($result, true);

    if (isset($response['choices'][0]['message']['content'])) {
        return ['success' => true, 'reply' => $response['choices'][0]['message']['content']];
    } else {
        return ['success' => false, 'message' => 'No response from AI.'];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $message = $input['message'] ?? '';
    $usingChatCache = $input['usingChatCache'] ?? false;
    $chatCache = $input['chatCache'] ?? [];

    $response = chatGPT($message, $usingChatCache, $chatCache);
    echo json_encode($response);
}
?>
