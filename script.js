
// Menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Premium Cart System
const cart = {
    items: [],
    total: 0,
    
    init() {
            console.log('Cart initialized.');
            this.bindEvents();
            this.loadCart();
        },
    
    bindEvents() {
            console.log('Binding cart events.');
            document.querySelector('.cart-icon').addEventListener('click', () => {
                console.log('Cart icon clicked.');
                document.getElementById('cartModal').classList.add('active');
                document.getElementById('modalOverlay').classList.add('active');
                document.querySelector('.cart-count').textContent = totalItems;
            });
        
        document.querySelector('.close-btn').addEventListener('click', () => {
                console.log('Close button clicked.');
                document.getElementById('cartModal').classList.remove('active');
                document.getElementById('modalOverlay').classList.remove('active');
            });
        
        document.getElementById('modalOverlay').addEventListener('click', () => {
            document.getElementById('cartModal').classList.remove('active');
            document.getElementById('modalOverlay').classList.remove('active');
        });

        document.querySelector('.checkout-btn').addEventListener('click', () => {
            alert('Proceeding to checkout!');
        });

        document.querySelector('.clear-cart-btn').addEventListener('click', () => {
            this.clearCart();
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Add to cart button clicked.', btn.dataset.name);
                const name = btn.dataset.name;
                const price = parseFloat(btn.dataset.price);
                const img = btn.dataset.img;
                this.addItem(name, price, img);
            });
        });
    },
    
    addItem(name, price, img) {
            console.log('Adding item:', name, price, img);
            const existingItem = this.items.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
                console.log('Increased quantity for existing item:', existingItem);
            } else {
                this.items.push({
                    name,
                    price,
                    quantity: 1,
                    img: img || 'https://via.placeholder.com/70x70?text=No+Image'
                });
                console.log('Added new item:', this.items[this.items.length - 1]);
            }
            
            this.updateCart();
            this.animateAddToCart();
            this.saveCart();
        },

    removeItem(name) {
            console.log('Removing item:', name);
            this.items = this.items.filter(item => item.name !== name);
            this.updateCart();
            this.saveCart();
        },

    clearCart() {
        this.items = [];
        this.updateCart();
        this.saveCart();
    },
    
    updateCount() {
        console.log('Updating cart count.');
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    },
    
    updateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.querySelector('.cart-total span:last-child').textContent = `₹${this.total.toLocaleString()}`;
    },
    
    renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items-container');
        cartItemsContainer.innerHTML = ''; 
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            return;
        }
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-name="${item.name}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-name="${item.name}">&#128465; Delete</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Add buttons and remove button
        cartItemsContainer.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const item = this.items.find(i => i.name === name);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    this.updateCart();
                    this.saveCart();
                } else if (item && item.quantity === 1) {
                    this.removeItem(name);
                }
            });
        });

        cartItemsContainer.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                const item = this.items.find(i => i.name === name);
                if (item) {
                    item.quantity++;
                    this.updateCart();
                    this.saveCart();
                }
            });
        });

        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const name = e.target.dataset.name;
                this.removeItem(name);
            });
        });
    },
    
    animateAddToCart() {
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.classList.add('added');
        setTimeout(() => {
            cartIcon.classList.remove('added');
        }, 500); 
        
        // Add particle effect
        const particle = document.createElement('div');
        particle.className = 'cart-particle';
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800); 
    },

    saveCart() {
        localStorage.setItem('kairoCart', JSON.stringify(this.items));
    },

    loadCart() {
        const storedCart = localStorage.getItem('kairoCart');
        if (storedCart) {
            this.items = JSON.parse(storedCart);
            this.updateCart();
        }
    },
    
    updateCart() {
        this.updateCount();
        this.updateTotal();
        this.renderCartItems();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});
