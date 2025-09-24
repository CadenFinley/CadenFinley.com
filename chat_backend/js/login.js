document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const result = await AccountHandler.login(username, password);
    showNotification(result.message, !result.success);
});

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
