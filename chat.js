let selectedReceiver = 'ai'; // Default receiver is 'ai'

document.getElementById('logout-button').addEventListener('click', () => {
    sessionStorage.removeItem('username');
    window.location.href = 'login';
});

document.addEventListener('DOMContentLoaded', function() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username) {
        window.location.href = 'login';
    } else {
        document.getElementById('user-name').textContent = `Welcome, ${username}`;
        loadUserList(username);
    }
});

function loadUserList(username) {
    fetch('get_user_chat_instances.php', {
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
            userList.innerHTML = ''; // Clear the user list
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
                    selectedReceiver = receiver; // Set the selected receiver
                    highlightSelectedUser(receiver); // Highlight the selected user
                    document.getElementById('clear-chat').style.display = receiver === 'ai' ? 'block' : 'none'; // Toggle clear chat button
                    document.getElementById('chat-input').placeholder = `Send a message to ${receiver}`; // Update placeholder
                    loadChatHistory(username, receiver);
                });
                userList.appendChild(userItem);
            });
            // Append the "New Chat" button at the end of the user list
            const newChatButton = document.createElement('button');
            newChatButton.id = 'new-chat';
            newChatButton.className = 'new-chat-button';
            newChatButton.textContent = 'New Chat';
            newChatButton.addEventListener('click', createNewChat);
            userList.appendChild(newChatButton);

            // Select the first user in the list by default, if any
            const firstUserItem = userList.querySelector('.user-item');
            if (firstUserItem) {
                firstUserItem.click();
            }
        } else {
            console.error('Error loading user list:', data.message);
            // Ensure the "New Chat" button is always available
            const userList = document.getElementById('user-list');
            userList.innerHTML = ''; // Clear the user list
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
        // Ensure the "New Chat" button is always available
        const userList = document.getElementById('user-list');
        userList.innerHTML = ''; // Clear the user list
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

function loadChatHistory(username, receiver) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = ''; // Clear the current chat box

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
            });
        } else {
            console.error('Error loading chat history:', data.message);
        }
    })
    .catch(error => {
        console.error('Error loading chat history:', error);
    });
}

function createNewChat() {
    const newChatUser = prompt('Enter the username of the user you want to chat with:');
    if (newChatUser) {
        const hashedUsername = sessionStorage.getItem('username');
        const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
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
            fetch('create_new_chat.php', {
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
