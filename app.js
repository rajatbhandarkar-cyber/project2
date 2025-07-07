// Login function with validation and authentication
class LoginSystem {
    constructor() {
        this.init();
        this.setupDemoUsers();
    }

    init() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberMeCheckbox = document.getElementById('rememberMe');
        this.messageDiv = document.getElementById('loginMessage');
        this.loginBtn = document.getElementById('loginBtn');

        this.setupEventListeners();
        this.checkRememberedUser();
    }

    setupDemoUsers() {
        // Demo users for testing (in real app, this would be handled by backend)
        this.validUsers = [
            { username: 'admin', email: 'admin@example.com', password: 'admin123' },
            { username: 'user', email: 'user@example.com', password: 'user123' },
            { username: 'demo', email: 'demo@example.com', password: 'demo123' }
        ];
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Real-time validation
        this.usernameInput.addEventListener('blur', () => this.validateUsername());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Clear errors on input
        this.usernameInput.addEventListener('input', () => this.clearError('usernameError'));
        this.passwordInput.addEventListener('input', () => this.clearError('passwordError'));

        // Forgot password handler
        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }

    validateUsername() {
        const username = this.usernameInput.value.trim();
        const errorElement = document.getElementById('usernameError');

        if (!username) {
            this.showError(errorElement, 'Username or email is required');
            return false;
        }

        if (username.length < 3) {
            this.showError(errorElement, 'Username must be at least 3 characters');
            return false;
        }

        this.clearError('usernameError');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const errorElement = document.getElementById('passwordError');

        if (!password) {
            this.showError(errorElement, 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showError(errorElement, 'Password must be at least 6 characters');
            return false;
        }

        this.clearError('passwordError');
        return true;
    }

    showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    async handleLogin(e) {
        e.preventDefault();

        // Validate inputs
        const isUsernameValid = this.validateUsername();
        const isPasswordValid = this.validatePassword();

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        // Simulate API call delay
        await this.delay(1000);

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        // Authenticate user
        const authResult = this.authenticateUser(username, password);

        if (authResult.success) {
            this.handleSuccessfulLogin(authResult.user);
        } else {
            this.handleFailedLogin(authResult.message);
        }

        this.setLoadingState(false);
    }

    authenticateUser(usernameOrEmail, password) {
        const user = this.validUsers.find(u => 
            (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
            u.password === password
        );

        if (user) {
            return { success: true, user: user };
        } else {
            return { success: false, message: 'Invalid username/email or password' };
        }
    }

    handleSuccessfulLogin(user) {
        // Store user session
        this.storeUserSession(user);

        // Handle remember me
        if (this.rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUser', user.username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Show success message
        this.showMessage(`Welcome back, ${user.username}!`, 'success');

        // Simulate redirect to dashboard (in real app, would redirect to protected route)
        setTimeout(() => {
            this.showMessage('Redirecting to dashboard...', 'success');
            // window.location.href = '/dashboard';
        }, 1500);
    }

    handleFailedLogin(message) {
        this.showMessage(message, 'error');
        
        // Clear password field for security
        this.passwordInput.value = '';
        
        // Focus on username field
        this.usernameInput.focus();
    }

    storeUserSession(user) {
        const sessionData = {
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        
        sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    }

    generateSessionId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    checkRememberedUser() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            this.usernameInput.value = rememberedUser;
            this.rememberMeCheckbox.checked = true;
        }
    }

    handleForgotPassword() {
        const username = this.usernameInput.value.trim();
        
        if (!username) {
            this.showMessage('Please enter your username or email first', 'error');
            this.usernameInput.focus();
            return;
        }

        // Simulate password reset
        this.showMessage(`Password reset link sent to ${username}`, 'success');
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.loginBtn.textContent = 'Logging in...';
            this.form.classList.add('loading');
        } else {
            this.loginBtn.textContent = 'Login';
            this.form.classList.remove('loading');
        }
    }

    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `message ${type}`;
        this.messageDiv.style.display = 'block';

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, 3000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Static method to check if user is logged in
    static isLoggedIn() {
        return sessionStorage.getItem('userSession') !== null;
    }

    // Static method to get current user
    static getCurrentUser() {
        const sessionData = sessionStorage.getItem('userSession');
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Static method to logout user
    static logout() {
        sessionStorage.removeItem('userSession');
        localStorage.removeItem('rememberedUser');
        window.location.reload();
    }
}

// Initialize login system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LoginSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginSystem;
}