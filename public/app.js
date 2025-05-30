// app.js

// Store the JWT token
let authToken = localStorage.getItem('authToken');

// API endpoints
const API = {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    signout: '/api/auth/signout',
    profile: '/api/users'
};

// DOM Elements
const elements = {
    loginForm: document.getElementById('loginForm'),
    signupForm: document.getElementById('signupForm'),
    profileSection: document.getElementById('profileSection'),
    updateProfileForm: document.getElementById('updateProfileForm'),
    authSection: document.getElementById('authSection'),
    navLinks: document.getElementById('navLinks'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage')
};

// Show/hide sections based on auth status
function updateUI() {
    const isAuthenticated = !!authToken;
    elements.authSection.classList.toggle('hidden', isAuthenticated);
    elements.profileSection.classList.toggle('hidden', !isAuthenticated);
    elements.navLinks.innerHTML = isAuthenticated
        ? '<a href="#" onclick="handleSignout()">Sign Out</a>'
        : '<a href="#" onclick="showLogin()">Login</a> <a href="#" onclick="showSignup()">Sign Up</a>';
}

// Show success message
function showSuccess(message) {
    elements.successMessage.textContent = message;
    elements.successMessage.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
}

// Show error message
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.successMessage.classList.add('hidden');
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch(API.signup, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                phone: formData.get('phone'),
                address: formData.get('address')
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Signup failed');

        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        showSuccess('Signup successful!');
        updateUI();
        loadProfile();
    } catch (error) {
        showError(error.message);
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch(API.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Login failed');

        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        showSuccess('Login successful!');
        updateUI();
        loadProfile();
    } catch (error) {
        showError(error.message);
    }
}

// Handle signout
async function handleSignout() {
    try {
        await fetch(API.signout, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Signout error:', error);
    } finally {
        authToken = null;
        localStorage.removeItem('authToken');
        updateUI();
        showSuccess('Signed out successfully!');
    }
}

// Load user profile
async function loadProfile() {
    try {
        const response = await fetch(API.profile, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const user = await response.json();

        if (!response.ok) throw new Error(user.error || 'Failed to load profile');

        // Update profile information
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
        document.getElementById('profileAddress').textContent = user.address || 'Not provided';
    } catch (error) {
        showError(error.message);
    }
}

// Handle profile update
async function handleProfileUpdate(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
        const response = await fetch(API.profile, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                role: formData.get('role')
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Update failed');

        showSuccess('Profile updated successfully!');
        loadProfile();
    } catch (error) {
        showError(error.message);
    }
}

// Show login form
function showLogin() {
    elements.loginForm.classList.remove('hidden');
    elements.signupForm.classList.add('hidden');
}

// Show signup form
function showSignup() {
    elements.signupForm.classList.remove('hidden');
    elements.loginForm.classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners
    elements.loginForm?.addEventListener('submit', handleLogin);
    elements.signupForm?.addEventListener('submit', handleSignup);
    elements.updateProfileForm?.addEventListener('submit', handleProfileUpdate);

    // Initial UI update
    updateUI();

    // Load profile if authenticated
    if (authToken) {
        loadProfile();
    }
});