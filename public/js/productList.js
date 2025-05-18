// d:\nodepg\node-cart\public\js\productList.js

document.addEventListener('DOMContentLoaded', () => {
    const productListContainer = document.getElementById('productListContainer');
    const errorMessageElement = document.getElementById('errorMessage'); // For displaying errors

    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch('/api/products'); // Your backend endpoint
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }
            const products = await response.json();

            if (!productListContainer) {
                console.error('Product list container (productListContainer) not found!');
                if (errorMessageElement) errorMessageElement.textContent = 'Product display area not found on the page.';
                return;
            }

            productListContainer.innerHTML = ''; // Clear previous content (e.g., "Loading...")

            if (products.length === 0) {
                productListContainer.innerHTML = '<p>No products found.</p>';
                return;
            }

            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card'; // For styling

                let imagesHTML = '<p>No images available</p>';
                if (product.imageLinks && product.imageLinks.length > 0) {
                    // Display the first image as an example
                    imagesHTML = `<img src="${product.imageLinks[0]}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 4px;">`;
                }

                let sellerInfo = 'Seller: Information not available';
                if (product.seller && product.seller.name) {
                    sellerInfo = `Seller: ${product.seller.name} (${product.seller.email || 'No email'})`;
                }

                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    ${imagesHTML}
                    <p><strong>Description:</strong> ${product.description || 'N/A'}</p>
                    <p><strong>Price:</strong> $${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                    <p><strong>Brand:</strong> ${product.brand || 'N/A'}</p>
                    <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
                    <p><strong>Stock:</strong> ${product.stock !== undefined ? product.stock : 'N/A'}</p>
                    <p><em>${sellerInfo}</em></p>
                    <button class="add-to-cart-btn" data-product-id="${product._id}">Add to Cart</button>
                `;
                productListContainer.appendChild(productCard);
            });

            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.target.getAttribute('data-product-id');
                    handleAddToCart(productId);
                });
            });

        } catch (error) {
            console.error('Failed to fetch products:', error);
            if (productListContainer) productListContainer.innerHTML = `<p style="color: red;">Error loading products: ${error.message}</p>`;
            if (errorMessageElement) errorMessageElement.textContent = `Error loading products: ${error.message}`;
        }
    }

    // async function handleAddToCart(productId) {
    //     const authToken = localStorage.getItem('authToken');
    //     if (!authToken) {
    //         alert('Please log in to add items to your cart.');
    //         // You might want to redirect to a login page here
    //         // window.location.href = '/login.html';
    //         return;
    //     }
    //     // Implementation for adding to cart (see explanation below)
    //     console.log(`Attempting to add product ${productId} to cart.`);
    //     alert(`(Placeholder) Add product ${productId} to cart. See console for details. You'll need to implement the fetch call to your /api/cart/add endpoint here.`);
    // }

    fetchAndDisplayProducts();
});// Inside public/js/productList.js

async function handleAddToCart(productId) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        alert('Please log in to add items to your cart.');
        // Optionally redirect to login page
        // window.location.href = '/login.html'; // Or your login page route
        return;
    }

    try {
        const response = await fetch('/api/cart/add', { // Your cart API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ productId: productId, quantity: 1 }) // Default quantity to 1
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to add product to cart.');
        }

        alert(result.message || 'Product added to cart successfully!');
        // Optionally, you could update a mini-cart display on the page here
        // or provide more sophisticated user feedback.
    } catch (error) {
        console.error('Add to cart error:', error);
        alert(`Error adding to cart: ${error.message}`);
    }
}
