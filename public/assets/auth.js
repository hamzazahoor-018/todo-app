const setMessage = (messageElement, text, type) => {
    if (!messageElement) {
        return;
    }

    messageElement.textContent = text;
    messageElement.dataset.state = type;
};

const submitAuthForm = async (form, messageElement, endpoint) => {
    const formData = new FormData(form);
    const payload = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    setMessage(messageElement, 'Please wait...', 'loading');

    try {
        const response = await fetchWithRefresh(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await handleFetchResponse(response);

        setMessage(messageElement, data.message || 'Success', 'success');
        window.location.href = '/todo';
    } catch (error) {
        setMessage(messageElement, error.message || 'Something went wrong', 'error');
    }
};

// Logout functionality
const handleLogout = async () => {
    try {
        const response = await fetchWithRefresh('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout error: ' + error.message);
    }
};

// Attach logout listener
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            submitAuthForm(loginForm, loginMessage, '/auth/login');
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            submitAuthForm(signupForm, signupMessage, '/auth/signup');
        });
    }
});
