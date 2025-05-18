// d:\nodepg\node-cart\public\js\app.js
// app.js

// Store the JWT token
let authToken = localStorage.getItem('authToken');

// API endpoints
const API = {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    signout: '/api/auth/signout',
    profile: '/api/users',
    addProduct: '/api/products' ,// Add product endpoint
    cart: '/api/cart'
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

// New function for role-based redirection
function performRoleBasedRedirect(role) {
    // console.log('Current role for redirection:', role);
    // console.log('Current pathname:', window.location.pathname);

    if (role === 'seller') {
        // If current page is not the root or index.html, redirect to root
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            // console.log('Redirecting seller to /');
            window.location.href = '/'; // Instructs browser to go to the homepage
        }
    } else if (role === 'customer') {
        // If current page is not /product_list, redirect there
        if (window.location.pathname !== '/product_list') {
            // console.log('Redirecting customer to /product_list');
            window.location.href = '/product_list'; // Instructs browser to go to product list page
        }
    }
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
        showSuccess('Signup successful! Redirecting...');
        updateUI();
        // console.log('Signup successful, role:', data.role);
        await loadProfile(); // loadProfile will now also handle redirection
    } catch (error) {
        showError(error.message);
    }
}

// Handle login
async function handleLogin(event) {
    // console.log('Login attempt started');
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
        showSuccess('Login successful! Redirecting...');
        updateUI();
        // console.log('Login successful, role:', data.role);
        await loadProfile();
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
    // console.log('Attempting to load profile...');
    try {
        const response = await fetch(API.profile, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        const user = await response.json();

        if (!response.ok) throw new Error(user.error || 'Failed to load profile');

        // console.log('Profile loaded:', user);

        // Update profile information
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone || 'Not provided';
        document.getElementById('profileAddress').textContent = user.address || 'Not provided';

        // Perform redirection after profile is loaded and role is available
        if (user && user.role) {
            performRoleBasedRedirect(user.role);
        }

    } catch (error) {
        console.error('Profile load error:', error);
        showError(error.message);
        // Consider robust error handling for invalid tokens:
        // if (error.message.includes('token') || error.message.includes('auth')) { // Or check response status if available
        //     authToken = null;
        //     localStorage.removeItem('authToken');
        //     updateUI();
        //     showError(`Session may have expired. Please log in again. Error: ${error.message}`);
        // }
    }
}

// Handle profile update
async function handleProfileUpdate(event) {
    event.preventDefault();// Prevent default form submission behavior
    const formData = new FormData(event.target);
    const apiData = {};
    if (formData.get('name')) apiData.name = formData.get('name');
    if (formData.get('phone')) apiData.phone = formData.get('phone');
    if (formData.get('address')) apiData.address = formData.get('address');
    if (formData.get('role')) apiData.role = formData.get('role');
    try {
        const response = await fetch(API.profile, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apiData)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Update failed:', data);
            throw new Error(data.error || 'Update failed');
        }

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