// DOM Elements
const profileForm = document.getElementById('profileForm');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const message = document.getElementById('message');
const cancelBtn = document.getElementById('cancelBtn');

// Current user data
let currentUser = null;
let userProfile = null;

// Initialize page
function initEditProfile() {
    // Check if user is logged in
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Load user profile data
    loadUserProfile();

    // Setup event listeners
    setupEventListeners();
}

// Load user profile data
function loadUserProfile() {
    const users = JSON.parse(localStorage.getItem('newsUsers')) || [];
    userProfile = users.find(user => user.id === currentUser.id);
    
    if (userProfile) {
        // Populate form fields
        document.getElementById('name').value = userProfile.name || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('bio').value = userProfile.bio || '';
        document.getElementById('location').value = userProfile.location || '';
        document.getElementById('website').value = userProfile.website || '';
        document.getElementById('phone').value = userProfile.phone || '';
        
        // Load avatar
        if (userProfile.avatar) {
            const img = document.createElement('img');
            img.src = userProfile.avatar;
            img.alt = 'Avatar';
            avatarPreview.innerHTML = '';
            avatarPreview.appendChild(img);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Avatar upload
    avatarInput.addEventListener('change', handleAvatarUpload);
    
    // Form submission
    profileForm.addEventListener('submit', handleFormSubmit);
    
    // Cancel button
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Handle avatar upload
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        showMessage('Harap pilih file gambar', 'error');
        return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showMessage('Ukuran file maksimal 2MB', 'error');
        return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Avatar';
        avatarPreview.innerHTML = '';
        avatarPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        location: document.getElementById('location').value.trim(),
        website: document.getElementById('website').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        avatar: getAvatarData()
    };

    // Validation
    if (!formData.name) {
        showMessage('Nama lengkap harus diisi', 'error');
        return;
    }

    if (!formData.email) {
        showMessage('Email harus diisi', 'error');
        return;
    }

    // Check if email is already used by another user
    const users = JSON.parse(localStorage.getItem('newsUsers')) || [];
    const emailExists = users.find(user => 
        user.email === formData.email && user.id !== currentUser.id
    );

    if (emailExists) {
        showMessage('Email sudah digunakan oleh pengguna lain', 'error');
        return;
    }

    // Update user profile
    updateUserProfile(formData);
}

// Get avatar data from preview
function getAvatarData() {
    const img = avatarPreview.querySelector('img');
    return img ? img.src : null;
}

// Update user profile in localStorage
function updateUserProfile(profileData) {
    const users = JSON.parse(localStorage.getItem('newsUsers')) || [];
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            ...profileData,
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('newsUsers', JSON.stringify(users));
        
        // Update current session
        const updatedSession = {
            ...currentUser,
            name: profileData.name,
            email: profileData.email
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));
        
        showMessage('Profil berhasil diperbarui!', 'success');
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showMessage('Terjadi kesalahan saat memperbarui profil', 'error');
    }
}

// Show message
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        message.style.display = 'none';
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initEditProfile);