// Product-related functionality

// API endpoints
const API = {
    addProduct: '/api/products'
};

// DOM Elements
const elements = {
    addProductForm: document.getElementById('addProductForm'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage')
};

// Show success message
function showSuccess(message) {
    elements.successMessage.textContent = message;
    elements.successMessage.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
}

// Show error message
function showError(message) {
    elements.errorMessage.textContent = message || 'An unexpected error occurred.';
    elements.errorMessage.classList.remove('hidden');
    elements.successMessage.classList.add('hidden');
}

// Handle Add Product
async function handleAddProduct(event) {
    try {
        event.preventDefault();
        const formData = new FormData(event.target);
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            showError('You must be logged in and authorized to add products.');
            return;
        }

        const productData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            brand: formData.get('brand'),
            category: formData.get('category'),
            imageLinks: formData.get('imageLinks') ? formData.get('imageLinks').split(',').map(url => url.trim()).filter(url => url) : []
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        };


        const response = await fetch(API.addProduct, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (response.status !== 201) {
            let errorMessage = 'Failed to add product.';
            if (data.error) errorMessage = data.error;
            if (data.errors) errorMessage = data.errors.map(e => e.msg).join(', ');
            throw new Error(errorMessage);
        }

        showSuccess('Product added successfully!');
        event.target.reset(); // Clear the form
        // Optionally, you might want to refresh a product list here
    } catch (error) {
        showError(error.message || 'An unexpected error occurred.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for product form
    elements.addProductForm?.addEventListener('submit', handleAddProduct);
});