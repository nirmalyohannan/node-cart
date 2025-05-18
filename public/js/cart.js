// d:\nodepg\node-cart\public\js\cart.js

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalElement = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn'); // Placeholder for future checkout
    const errorMessageElement = document.getElementById('errorMessage');
    const successMessageElement = document.getElementById('successMessage');

    // Assuming authToken is managed by app.js and available via localStorage
    const authToken = localStorage.getItem('authToken');

    // Helper function to show messages (can be shared with app.js)
    function showMessage(element, message, isError = false) {
        if (isError) {
            errorMessageElement.textContent = message;
            errorMessageElement.classList.remove('hidden');
            successMessageElement.classList.add('hidden');
        } else {
            successMessageElement.textContent = message;
            successMessageElement.classList.remove('hidden');
            errorMessageElement.classList.add('hidden');
        }
    }

    function clearMessages() {
        errorMessageElement.classList.add('hidden');
        successMessageElement.classList.add('hidden');
    }

    async function fetchAndDisplayCart() {
        clearMessages();
        if (!authToken) {
            cartItemsContainer.innerHTML = '<p>Please log in to view your cart.</p>';
            cartTotalElement.textContent = '0.00';
            // Disable cart actions if not logged in
            clearCartBtn.disabled = true;
            checkoutBtn.disabled = true;
            return;
        }

        try {
            cartItemsContainer.innerHTML = '<p class="loading-message">Loading cart...</p>'; // Show loading
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                 // If cart not found (e.g., new user), backend might return 404 or empty cart
                 // Check if it's a specific "Cart not found" error or a general error
                 if (response.status === 404 && data.error === 'Cart not found') {
                     cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                     cartTotalElement.textContent = '0.00';
                     clearCartBtn.disabled = true;
                     checkoutBtn.disabled = true;
                     return; // Exit if cart is genuinely not found/empty
                 }
                 throw new Error(data.error || `Failed to fetch cart: HTTP status ${response.status}`);
            }

            const cart = data; // The response includes cart details and total

            cartItemsContainer.innerHTML = ''; // Clear loading/previous content

            if (!cart || !cart.products || cart.products.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartTotalElement.textContent = '0.00';
                clearCartBtn.disabled = true;
                checkoutBtn.disabled = true;
                return;
            }

            cart.products.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                    </div>
                    <div class="item-controls">
                        <input type="number" value="${item.quantity}" min="1" data-product-id="${item.productId}">
                        <button class="update-btn" data-product-id="${item.productId}">Update</button>
                        <button class="remove-btn" data-product-id="${item.productId}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            cartTotalElement.textContent = cart.total ? cart.total.toFixed(2) : '0.00';

            // Enable cart actions if items are present
            clearCartBtn.disabled = false;
            checkoutBtn.disabled = false;

        } catch (error) {
            console.error('Failed to fetch cart:', error);
            cartItemsContainer.innerHTML = `<p style="color: red;">Error loading cart: ${error.message}</p>`;
            cartTotalElement.textContent = '0.00';
            clearCartBtn.disabled = true;
            checkoutBtn.disabled = true;
        }
    }

    async function updateCartItem(productId, quantity) {
        clearMessages();
        if (!authToken) {
            showMessage(errorMessageElement, 'You must be logged in to update your cart.', true);
            return;
        }
        try {
            const response = await fetch('/api/cart/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ productId, quantity })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update cart item.');
            showMessage(successMessageElement, data.message || 'Cart item updated.');
            fetchAndDisplayCart(); // Refresh the cart display
        } catch (error) {
            console.error('Update cart error:', error);
            showMessage(errorMessageElement, `Error updating item: ${error.message}`, true);
        }
    }

    async function removeCartItem(productId) {
         clearMessages();
         if (!authToken) {
             showMessage(errorMessageElement, 'You must be logged in to remove items from your cart.', true);
             return;
         }
         if (!confirm('Are you sure you want to remove this item?')) return;

         try {
             const response = await fetch('/api/cart/remove', {
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${authToken}`
                 },
                 body: JSON.stringify({ productId })
             });
             const data = await response.json();
             if (!response.ok) throw new Error(data.error || 'Failed to remove cart item.');
             showMessage(successMessageElement, data.message || 'Cart item removed.');
             fetchAndDisplayCart(); // Refresh the cart display
         } catch (error) {
             console.error('Remove cart error:', error);
             showMessage(errorMessageElement, `Error removing item: ${error.message}`, true);
         }
    }

    async function clearCart() {
        clearMessages();
        if (!authToken) {
            showMessage(errorMessageElement, 'You must be logged in to clear your cart.', true);
            return;
        }
        if (!confirm('Are you sure you want to clear your entire cart?')) return;

        try {
            const response = await fetch('/api/cart/clear', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to clear cart.');
            showMessage(successMessageElement, data.message || 'Cart cleared.');
            fetchAndDisplayCart(); // Refresh the cart display (should show empty)
        } catch (error) {
            console.error('Clear cart error:', error);
            showMessage(errorMessageElement, `Error clearing cart: ${error.message}`, true);
        }
    }

    // Add event listeners using event delegation on the container
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.getAttribute('data-product-id');

        if (!productId) return; // Not a button with product ID

        if (target.classList.contains('update-btn')) {
            const quantityInput = target.closest('.cart-item').querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput.value, 10);
            if (!isNaN(quantity) && quantity >= 1) {
                updateCartItem(productId, quantity);
            } else {
                showMessage(errorMessageElement, 'Please enter a valid quantity (minimum 1).', true);
            }
        } else if (target.classList.contains('remove-btn')) {
            removeCartItem(productId);
        }
    });

    // Add event listener for the clear cart button
    clearCartBtn.addEventListener('click', clearCart);

    // Add event listener for the checkout button (placeholder)
    checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality is not yet implemented.');
        // You would implement the checkout process here
    });

    // Initial fetch and display of the cart
    fetchAndDisplayCart();
});