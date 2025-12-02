// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');

// Switch between login and register forms
showRegister.addEventListener('click', () => {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    clearMessages();
});

showLogin.addEventListener('click', () => {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    clearMessages();
});

// Clear message displays
function clearMessages() {
    loginMessage.style.display = 'none';
    registerMessage.style.display = 'none';
}

// Show message
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
}

// Register form handler
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage(registerMessage, 'Password dan konfirmasi password tidak cocok', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(registerMessage, 'Password harus minimal 6 karakter', 'error');
        return;
    }
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('newsUsers')) || [];
    const userExists = existingUsers.find(user => user.email === email);
    
    if (userExists) {
        showMessage(registerMessage, 'Email sudah terdaftar', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Note: In a real app, passwords should be hashed
        createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('newsUsers', JSON.stringify(existingUsers));
    
    showMessage(registerMessage, 'Pendaftaran berhasil! Silakan login.', 'success');
    
    // Clear form
    registerFormElement.reset();
    
    // Switch to login form after 2 seconds
    setTimeout(() => {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        clearMessages();
    }, 2000);
});

// Login form handler
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('newsUsers')) || [];
    const user = existingUsers.find(user => user.email === email && user.password === password);
    
    if (!user) {
        showMessage(loginMessage, 'Email atau password salah', 'error');
        return;
    }
    
    // Store current user session
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        loggedInAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    showMessage(loginMessage, 'Login berhasil! Mengalihkan...', 'success');
    
    // Redirect to main page after 1 second
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
});

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.endsWith('login.html')) {
        window.location.href = 'index.html';
    }
}

// Initialize
checkAuthStatus();