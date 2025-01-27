document.addEventListener('DOMContentLoaded', function() {
    const hashedUsername = sessionStorage.getItem('username');
    const username = hashedUsername ? atob(hashedUsername) : null; // Decode the hashed username
    if (!username || username !== 'admin') {
        window.location.href = 'login';
    } else {
        document.getElementById('admin-name').textContent = `Welcome, ${username}`;
        loadUsers();
        loadVisits(); // Load visits count
    }

    document.getElementById('logout-button').addEventListener('click', () => {
        sessionStorage.removeItem('username');
        window.location.href = 'login';
    });
});

async function loadUsers() {
    try {
        const response = await fetch('get_users.php');
        const users = await response.json();
        if (response.ok) {
            populateUserTable(users);
        } else {
            showNotification('Failed to load users.', true);
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showNotification('An error occurred while loading users.', true);
    }
}

async function loadVisits() {
    try {
        const response = await fetch('increment_visits.php');
        const data = await response.json();
        if (response.ok && data.success) {
            document.getElementById('visit-count').textContent = `Total Visits: ${data.visits}`;
        } else {
            showNotification('Failed to load visit count.', true);
        }
    } catch (error) {
        console.error('Error loading visit count:', error);
        showNotification('An error occurred while loading visit count.', true);
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
                <button onclick="deleteUser('${user.username}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

async function deleteUser(username) {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) return;

    try {
        const response = await fetch('delete_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const result = await response.json();
        if (response.ok && result.success) {
            showNotification('User deleted successfully.');
            loadUsers();
        } else {
            showNotification('Failed to delete user.', true);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('An error occurred while deleting the user.', true);
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
