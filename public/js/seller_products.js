document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('sellerProductListContainer');
    const messageArea = document.getElementById('messageArea');
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        showMessage('You must be logged in as a seller to view this page.', 'error');
        productListContainer.innerHTML = '<p class="no-products-message">Please <a href="/login.html">log in</a>.</p>';
        // Potentially redirect to login or show limited view
        return;
    }

    function showMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.className = type === 'success' ? 'success-message' : 'error-message';
        messageArea.classList.remove('hidden');
        setTimeout(() => {
            messageArea.classList.add('hidden');
        }, 5000);
    }

    async function fetchSellerProducts() {
        try {
            // This endpoint should be protected and return products for the authenticated seller
            const response = await fetch('/api/seller/products', { // Corrected API endpoint
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to fetch products (Status: ${response.status})`);
            }

            const products = await response.json();
            renderProducts(products);

        } catch (error) {
            console.error('Error fetching seller products:', error);
            showMessage(`Error: ${error.message}`, 'error');
            productListContainer.innerHTML = '<p class="no-products-message">Could not load your products. Please try again later.</p>';
        }
    }

    function renderProducts(products) {
        productListContainer.innerHTML = ''; // Clear loading message or previous content

        if (!products || products.length === 0) {
            productListContainer.innerHTML = '<p class="no-products-message">You have not submitted any products yet. <a href="/pages/product.html">Add your first product!</a></p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}" alt="${product.name || 'Product Image'}" onerror="this.onerror=null;this.src='/images/placeholder.png';">
                <h3>${product.name || 'N/A'}</h3>
                <p><strong>Price:</strong> ₹${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                <p><strong>Stock:</strong> ${product.stockQuantity !== undefined ? product.stockQuantity : 'N/A'}</p>
                <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
                <p><em>${product.description ? product.description.substring(0, 100) + (product.description.length > 100 ? '...' : '') : 'No description.'}</em></p>
                <div class="product-actions">
                    <button class="edit-btn" data-product-id="${product._id}">Edit</button>
                    <button class="delete-btn" data-product-id="${product._id}">Delete</button>
                </div>
            `;
            productListContainer.appendChild(card);
        });

        // Add event listeners for new buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEditProduct);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteProduct);
        });
    }

    function handleEditProduct(event) {
        const productId = event.target.dataset.productId;
        // Redirect to an edit page, passing product ID as a query parameter
        // Example: window.location.href = `/pages/edit_product.html?id=${productId}`;
        // For now, just log:
        console.log(`Edit product with ID: ${productId}`);
        showMessage(`Edit functionality for product ${productId} would be implemented here. You might redirect to an edit form.`, 'success');
        // You'll need to create an edit_product.html page similar to product.html,
        // pre-filled with product data and submitting to an update API endpoint.
    }

    async function handleDeleteProduct(event) {
        const productId = event.target.dataset.productId;
        if (!confirm(`Are you sure you want to delete this product? This action cannot be undone.`)) {
            return;
        }

        try {
            // IMPORTANT: Replace '/api/products/${productId}' with your actual backend delete endpoint
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete product (Status: ${response.status})`);
            }
            showMessage('Product deleted successfully!', 'success');
            fetchSellerProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            showMessage(`Error: ${error.message}`, 'error');
        }
    }

    fetchSellerProducts();
});