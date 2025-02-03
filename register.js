document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', true);
        return;
    }

    const result = await AccountHandler.register(username, password);
    showNotification(result.message, !result.success);
});

function validateForm() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password !== confirmPassword) {
        document.getElementById('feedback-message').style.display = 'block';
        document.getElementById('feedback-message').innerText = 'Passwords do not match.';
        return false;
    }
    return true;
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
