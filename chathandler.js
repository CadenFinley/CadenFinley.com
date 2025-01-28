document.getElementById('chat-send').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('clear-chat').addEventListener('click', clearChat);

let chatCache = [];

// Clear chat box on page load
document.addEventListener('DOMContentLoaded', function() {
    loadChatFromDatabase();
    highlightSelectedUser('ai'); // Highlight AI chat on page load
    startMessageCheck();
});

function sendMessage() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) {
        showNotification('You must be logged in to send messages.', true);
        return;
    }

    if (selectedReceiver === 'ai') {
        processMessage(username, 'ai');
    } else {
        checkMessageLimit(username).then(canSend => {
            if (!canSend) {
                showNotification('You have reached the limit of 10 messages in 24 hours.', true);
                return;
            }
            processMessage(username, selectedReceiver);
        });
    }
}

function processMessage(sender, receiver) {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message === '') return;

    const timestamp = new Date().toISOString();
    addMessageToChat('user-message', message);
    chatCache.push({ sender: sender, message: message, timestamp: timestamp });
    input.value = '';

    if (receiver === 'ai') {
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
                const replyTimestamp = new Date().toISOString();
                addMessageToChat('ai-message', formattedReply);
                chatCache.push({ sender: 'ai', message: formattedReply, timestamp: replyTimestamp });
                // Increment messages_sent and messages_sent_24h
                incrementMessageCount(true);
                // Update sent_history in user_chats table
                updateSentHistory(sender, 'ai', message, timestamp);
                updateSentHistory('ai', sender, formattedReply, replyTimestamp);
            } else {
                addMessageToChat('ai-message', 'Error: ' + data.message);
            }
        })
        .catch(error => {
            // Remove "Generating Response..." message
            removeMessageFromChat(generatingMessageId);
            console.log('Error processing message:', message, error);
            showNotification('An error occurred while processing the message: '+ error.message, true);
        });
    } else {
        // Update sent_history in user_chats table
        updateSentHistory(sender, receiver, message, timestamp);
        // Increment messages_sent only
        incrementMessageCount(false);
    }
}

function updateSentHistory(sender, receiver, message, timestamp) {
    fetch('update_sent_history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sender: sender,
            receiver: receiver,
            message: message,
            timestamp: timestamp
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error updating sent history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error updating sent history:', error);
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

function incrementMessageCount(isAIQuery) {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) return;

    fetch('increment_message_count.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, isAIQuery: isAIQuery })
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

    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) return;

    fetch('clear_chat_history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Error clearing chat history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error clearing chat history:', error);
    });
}

function loadChatFromDatabase() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) return;

    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear the current chat box
    chatCache = []; // Clear the chat cache

    fetch('load_chat_history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, receiver: 'ai'})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            chatCache = data.chatHistory;
            chatCache.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            chatCache.forEach(item => {
                const messageClass = item.sender === username ? 'user-message' : 'ai-message';
                addMessageToChat(messageClass, item.message);
            });
        } else {
            console.error('Error loading chat history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error loading chat history:', error);
    });
}

function loadChatHistory(username, receiver) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear the current chat box
    chatCache = []; // Clear the chat cache

    fetch('load_chat_history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, receiver: receiver })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.chatHistory.forEach(item => {
                const messageClass = item.sender === username ? 'user-message' : 'ai-message';
                addMessageToChat(messageClass, item.message);
                chatCache.push(item); // Add to chat cache
            });
        } else {
            console.error('Error loading chat history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error loading chat history:', error);
    });
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

function highlightSelectedUser(receiver) {
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => {
        if (item.textContent === receiver) {
            item.classList.add('selected-user');
        } else {
            item.classList.remove('selected-user');
        }
    });
}

function startMessageCheck() {
    setInterval(checkForNewMessages, 3000); // Check for new messages every 5 seconds
}

function checkForNewMessages() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) return;

    fetch('load_chat_history.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, receiver: selectedReceiver })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const newMessages = data.chatHistory.filter(item => !chatCache.some(cachedItem => cachedItem.timestamp === item.timestamp));
            if (newMessages.length > 0) {
                newMessages.forEach(item => {
                    const messageClass = item.sender === username ? 'user-message' : 'ai-message';
                    addMessageToChat(messageClass, item.message);
                    chatCache.push(item);
                });
                chatCache.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            }
        }
    })
    .catch(error => {
        console.error('Error checking for new messages:', error);
    });
}