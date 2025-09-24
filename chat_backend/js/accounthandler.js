class AccountHandler {
    static async register(username, password) {
        try {
            const response = await fetch('../chat_backend/php/register.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return result;
        } catch (error) {
            console.error('Error during registration:', error);
            window.location.href = 'register.html?status=error';
            return { success: false, message: `An error occurred while creating the account: ${error.message}` };
        }
    }

    static async login(username, password) {
        try {
            const response = await fetch('../chat_backend/php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            if (result.success) {
                const hashedUsername = btoa(username);
                sessionStorage.setItem('username', hashedUsername);
                window.location.href = result.redirect;
            }
            return result;
        } catch (error) {
            console.error('Error during login:', error);
            return { success: false, message: `An error occurred while logging in: ${error.message}` };
        }
    }
}