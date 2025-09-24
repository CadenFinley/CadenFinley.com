document.addEventListener('DOMContentLoaded', function() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null;
    const hashedAdminName = btoa('admin');
    if (!username || btoa(username) !== hashedAdminName) {
        window.location.href = 'login';
    } else {
        document.getElementById('admin-name').textContent = `Welcome, ${username}`;
        loadUsers();
        loadVisits();
    }

    document.getElementById('logout-button').addEventListener('click', () => {
        sessionStorage.removeItem('username');
        window.location.href = 'login';
    });
});

async function loadUsers() {
    try {
        const response = await fetch('../chat_backend/php/get_users.php');
        const users = await response.json();
        if (response.ok) {
            populateUserTable(users);
        } else {
            showNotification('Failed to load users.', true);
            alert('Failed to load users.');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('An error occurred while loading users.', true);
        alert('An error occurred while loading users.');
    }
}

async function loadVisits() {
    try {
        const response = await fetch('../chat_backend/php/increment_visits.php');
        const data = await response.json();
        if (response.ok && data.success) {
            document.getElementById('visit-count').textContent = `Total Visits: ${data.visits}`;
        } else {
            showNotification('Failed to load visit count.', true);
            alert('Failed to load visit count.');
        }
    } catch (error) {
        console.error('Error loading visit count:', error);
        showNotification('An error occurred while loading visit count.', true);
        alert('An error occurred while loading visit count.');
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#user-table tbody');
    userTableBody.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${new Date(user.lastlogin).toLocaleString()}</td>
            <td>${user.messages_sent}</td>
            <td>
                ${user.username !== 'admin' ? `<button onclick="deleteUser('${user.username}')">Delete</button>` : ''}
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

async function deleteUser(username) {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) return;

    try {
        const response = await fetch('../chat_backend/php/delete_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username }) // Send the username directly
        });
        const result = await response.json();
        if (response.ok && result.success) {
            showNotification('User deleted successfully.');
            alert('User deleted successfully.');
            loadUsers();
        } else {
            console.error(`Failed to delete user: ${result.message}`);
            showNotification(`Failed to delete user: ${result.message}`, true);
            alert(`Failed to delete user: ${result.message}`);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('An error occurred while deleting the user.', true);
        alert('An error occurred while deleting the user.');
    }
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
