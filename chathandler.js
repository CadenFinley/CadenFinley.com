document.getElementById('chat-send').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('clear-chat').addEventListener('click', clearChat);

let chatCache = [];

// Clear chat box on page load if no chat cache is present
document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem('chatCache')) {
        clearChat();
    }
    loadChatFromSession();
});

function sendMessage() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) {
        showNotification('You must be logged in to send messages.', true);
        return;
    }

    if (username === 'admin') {
        processMessage();
    } else {
        checkMessageLimit(username).then(canSend => {
            if (!canSend) {
                showNotification('You have reached the limit of 10 messages in 24 hours.', true);
                return;
            }
            processMessage();
        });
    }
}

function processMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;

    addMessageToChat('user-message', message);
    chatCache.push({ sender: 'user', message: message });
    input.value = '';

    // Save chat to session storage
    saveChatToSession();

    // Add "Generating Response..." message
    const generatingMessageId = 'generating-message';
    addMessageToChat('ai-message', 'Generating Response...', generatingMessageId);

    fetch('ai.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message, usingChatCache: true, chatCache: chatCache.map(item => item.message) })
    })
    .then(response => response.json())
    .then(data => {
        // Remove "Generating Response..." message
        removeMessageFromChat(generatingMessageId);

        if (data.success) {
            const formattedReply = formatMessage(data.reply);
            addMessageToChat('ai-message', formattedReply);
            chatCache.push({ sender: 'ai', message: formattedReply });

            // Save chat to session storage
            saveChatToSession();

            // Increment messages_sent and messages_sent_24h
            incrementMessageCount();
        } else {
            addMessageToChat('ai-message', 'Error: ' + data.message);
        }
    })
    .catch(error => {
        // Remove "Generating Response..." message
        removeMessageFromChat(generatingMessageId);

        addMessageToChat('ai-message', 'Error: ' + error.message);
    });
}

function checkMessageLimit(username) {
    return fetch('check_message_limit.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return data.canSend;
        } else {
            console.error('Error checking message limit:', data.message);
            return false;
        }
    })
    .catch(error => {
        console.error('Error checking message limit:', error);
        return false;
    });
}

function incrementMessageCount() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) return;

    fetch('increment_message_count.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error incrementing message count:', data.message);
        }
    })
    .catch(error => {
        console.error('Error incrementing message count:', error);
    });
}

function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    chatCache = [];
    sessionStorage.removeItem('chatCache');
}

function saveChatToSession() {
    sessionStorage.setItem('chatCache', JSON.stringify(chatCache));
}

function loadChatFromSession() {
    const savedChat = sessionStorage.getItem('chatCache');
    if (savedChat) {
        chatCache = JSON.parse(savedChat);
        chatCache.forEach(item => {
            addMessageToChat(item.sender === 'user' ? 'user-message' : 'ai-message', item.message);
        });
    }
}

function addMessageToChat(className, message, id = '') {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message ' + className;
    messageElement.innerHTML = message; // Changed from textContent to innerHTML
    if (id) {
        messageElement.id = id;
    }
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeMessageFromChat(id) {
    const messageElement = document.getElementById(id);
    if (messageElement) {
        messageElement.remove();
    }
}

function formatMessage(message) {
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const escapedMessage = escapeHtml(message);
    const formattedMessage = escapedMessage
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<u>$1</u>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    return formattedMessage;
}

function showNotification(message, isError = false) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.innerText = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 5000);
}