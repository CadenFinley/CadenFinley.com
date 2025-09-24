let selectedReceiver = 'ai';
let chatCache = [];

document.getElementById('logout-button').addEventListener('click', () => {
    sessionStorage.removeItem('username');
    window.location.href = 'login';
});

document.addEventListener('DOMContentLoaded', function() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null;
    if (!username) {
        window.location.href = 'login';
    } else {
        document.getElementById('user-name').textContent = `Welcome, ${username}`;
        loadUserList(username);
        highlightSelectedUser('ai');
        startMessageCheck();
    }
});

function loadUserList(username) {
    fetch('../chat_backend/php/get_user_chat_instances.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            const receivers = new Set();
            data.chatInstances.forEach(instance => {
                if (instance.sender_user === username) {
                    receivers.add(instance.receiver_user);
                }
            });
            receivers.forEach(receiver => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.textContent = receiver;
                userItem.addEventListener('click', () => {
                    selectedReceiver = receiver;
                    highlightSelectedUser(receiver);
                    loadChatHistory(username, receiver);
                    document.getElementById('clear-chat').style.display = receiver === 'ai' ? 'block' : 'none';
                    document.getElementById('chat-input').placeholder = `Send a message to ${receiver}`;
                });
                userList.appendChild(userItem);
            });
            const newChatButton = document.createElement('button');
            newChatButton.id = 'new-chat';
            newChatButton.className = 'new-chat-button';
            newChatButton.textContent = 'New Chat';
            newChatButton.addEventListener('click', createNewChat);
            userList.appendChild(newChatButton);
            const firstUserItem = userList.querySelector('.user-item');
            if (firstUserItem) {
                firstUserItem.click();
            }
        } else {
            console.error('Error loading user list:', data.message);
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            const newChatButton = document.createElement('button');
            newChatButton.id = 'new-chat';
            newChatButton.className = 'new-chat-button';
            newChatButton.textContent = 'New Chat';
            newChatButton.addEventListener('click', createNewChat);
            userList.appendChild(newChatButton);
        }
    })
    .catch(error => {
        console.error('Error loading user list:', error);
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';
        const newChatButton = document.createElement('button');
        newChatButton.id = 'new-chat';
        newChatButton.className = 'new-chat-button';
        newChatButton.textContent = 'New Chat';
        newChatButton.addEventListener('click', createNewChat);
        userList.appendChild(newChatButton);
    });
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

function createNewChat() {
    const newChatUser = prompt('Enter the username of the user you want to chat with:');
    if (newChatUser) {
        const hashedUsername = sessionStorage.getItem('username');
        const username = hashedUsername ? atob(hashedUsername) : null;
        if (username) {
            if (newChatUser === username) {
                showNotification('You cannot chat with yourself.', true);
                return;
            }
            if(newChatUser === 'ai') {
                showNotification('You cannot chat with the AI.', true);
                return;
            }
            const userItems = document.querySelectorAll('.user-item');
            for (let item of userItems) {
                if (item.textContent === newChatUser) {
                    showNotification('You already have a chat with this user.', true);
                    return;
                }
            }
            fetch('../chat_backend/php/create_new_chat.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sender: username, receiver: newChatUser })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadUserList(username);
                    showNotification('New chat created successfully.');
                } else {
                    showNotification('Error creating new chat: ' + data.message, true);
                }
            })
            .catch(error => {
                showNotification('An error occurred: ' + error.message, true);
            });
        }
    }
}

document.getElementById('chat-send').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('clear-chat').addEventListener('click', clearChat);

function sendMessage() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null;
    if (!username) {
        showNotification('You must be logged in to send messages.', true);
        return;
    }

    if (selectedReceiver === 'ai') {
        checkMessageLimit(username).then(canSend => {
            if (!canSend) {
                showNotification('You have reached the limit of 10 messages in 24 hours.', true);
                return;
            }
            processMessage(username, 'ai');
        });
    } else {
        processMessage(username, selectedReceiver);
    }
}

function loadChatHistory(username, receiver) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    chatCache = [];

    fetch('../chat_backend/php/load_chat_history.php', {
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
                chatCache.push(item);
            });
        } else {
            console.error('Error loading chat history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error loading chat history:', error);
    });
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

        fetch('../chat_backend/php/ai.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message, usingChatCache: true, chatCache: chatCache.map(item => item.message) })
        })
        .then(response => response.json())
        .then(data => {
            removeMessageFromChat(generatingMessageId);
            if (data.success) {
                const formattedReply = formatMessage(data.reply);
                const replyTimestamp = new Date().toISOString();
                addMessageToChat('ai-message', formattedReply);
                chatCache.push({ sender: 'ai', message: formattedReply, timestamp: replyTimestamp });
                incrementMessageCount(true);
                updateSentHistory(sender, 'ai', message, timestamp);
                updateSentHistory('ai', sender, formattedReply, replyTimestamp);
            } else {
                addMessageToChat('ai-message', 'Error: ' + data.message);
            }
        })
        .catch(error => {
            removeMessageFromChat(generatingMessageId);
            console.log('Error processing message:', message, error);
            showNotification('An error occurred while processing the message: '+ error.message, true);
        });
    } else {
        updateSentHistory(sender, receiver, message, timestamp);
        incrementMessageCount(false);
    }
}

function updateSentHistory(sender, receiver, message, timestamp) {
    fetch('../chat_backend/php/update_sent_history.php', {
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
    return fetch('../chat_backend/php/check_message_limit.php', {
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
    const username = hashedUsername ? atob(hashedUsername) : null;
    if (!username) return;

    fetch('../chat_backend/php/increment_message_count.php', {
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
    const username = hashedUsername ? atob(hashedUsername) : null;
    if (!username) return;

    fetch('../chat_backend/php/clear_chat_history.php', {
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

function addMessageToChat(className, message, id = '') {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message ' + className;
    messageElement.innerHTML = message;
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

function startMessageCheck() {
    setInterval(checkForNewMessages, 2000);
}

function checkForNewMessages() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null;
    if (!username) return;
    fetch('../chat_backend/php/load_chat_history.php', {
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
