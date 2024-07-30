document.addEventListener("DOMContentLoaded", function() {
    const productGrid = document.getElementById('product-grid');
    const loadMoreButton = document.getElementById('load-more');
    const cartItems = document.getElementById('cart-items');
    const finalizeOrderButton = document.getElementById('finalize-order');
    let products = [
        {
            id: 1,
            name: 'Martillo',
            description: 'Martillo de acero con mango de madera.',
            price: '15.00',
            image: 'images/martillo.jpg' // Asegúrate de tener esta imagen en la carpeta images
        },
        {
            id: 2,
            name: 'Punta Estría',
            description: 'Punta estría de alta calidad.',
            price: '5.00',
            image: 'images/punta-estria.jpg' // Asegúrate de tener esta imagen en la carpeta images
        },
        {
            id: 3,
            name: 'Tornillos',
            description: 'Paquete de tornillos de diferentes tamaños.',
            price: '10.00',
            image: 'images/tornillos.jpg' // Asegúrate de tener esta imagen en la carpeta images
        }
    ];
    let productsPerPage = 3; // Ajusta esto si quieres mostrar más productos por página
    let currentPage = 1;
    let cart = [];

    // Función para cargar productos
    function loadProducts(page = 1) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const productsToLoad = products.slice(start, end);

        productsToLoad.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <div class="quantity">
                    <label for="quantity-${product.id}">Cantidad:</label>
                    <input type="number" id="quantity-${product.id}" min="1" value="1">
                </div>
                <button class="btn add-to-cart" data-id="${product.id}">Añadir al carrito</button>
            `;
            productGrid.appendChild(productElement);
        });

        if (end >= products.length) {
            loadMoreButton.style.display = 'none';
        }
    }

    // Agregar productos al carrito
    function addToCart(productId, quantity) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            // Verifica si el producto ya está en el carrito
            let cartItem = cart.find(item => item.id === parseInt(productId));
            if (cartItem) {
                // Si ya está, suma la cantidad
                cartItem.quantity += quantity;
            } else {
                // Si no está, añade nuevo artículo al carrito
                cart.push({ ...product, quantity });
            }
            updateCart();
        }
    }

    // Actualizar el carrito de compras
    function updateCart() {
        cartItems.innerHTML = '';
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <button class="btn remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(itemElement);
        });
    }

    // Finalizar pedido
    function finalizeOrder() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos al carrito antes de finalizar el pedido.');
            return;
        }

        let orderDetails = cart.map(item => `${item.name} - $${item.price} x ${item.quantity}`).join('%0A');
        let total = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
        let whatsappMessage = `Hola, quisiera hacer el siguiente pedido:%0A${orderDetails}%0ATotal: $${total}`;
        let whatsappURL = `https://wa.me/3012519740?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Redirige al usuario a WhatsApp con el mensaje pre-llenado
        window.open(whatsappURL, '_blank');
        cart = [];
        updateCart();
    }

    loadProducts(currentPage);

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadProducts(currentPage);
    });

    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productId = event.target.getAttribute('data-id');
            const quantityInput = document.getElementById(`quantity-${productId}`);
            const quantity = parseInt(quantityInput.value);
            addToCart(productId, quantity);
        }
    });

    cartItems.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            cart.splice(index, 1);
            updateCart();
        }
    });

    finalizeOrderButton.addEventListener('click', finalizeOrder);
});