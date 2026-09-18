const WHATSAPP_NUMBER = "966530725809";
    const DELIVERY_CHARGE = 25;
    let cart = [];
    let currentCategory = 'All';

    // Helper function to calculate final price after discount percentage
    function getDiscountedPrice(price, discountPercent = 0) {
        if (!discountPercent || discountPercent <= 0) return price;
        return Math.round(price - (price * (discountPercent / 100)));
    }

    const products = [
        {
            id: 1,
            code: "P-101",
            name: "Pure Cotton Fabric Bra",
            price: 110,
            discount:0,
            category: "Woman",
            images: ["rwein10.jpg"],
            image: "rwein10.jpg",
            description: "Comfort and Quality: The Cotton Fabric You Deserve."
        },
        {
            id: 2,
            code: "P-102",
            name: "Wide Strap Goddy",
            price: 99,
            discount:0,
            category: "Woman",
            images: ["rwein11.jpg"],
            image: "rwein11.jpg",
            description: "বেল্ট ও শোল্ডার স্ট্র্যাপ: অতিরিক্ত স্থায়িত্ব ও কমফোর্টের জন্য এতে ব্যবহার করা হয়েছে চওড়া বা মোটা ফিতা (Wide / Thick Straps) এবং চওড়া সাইড বেল্ট।"
        },
        {
            id: 3,
            code: "P-103",
            name: "Indian Copy Stitch Bra",
            price: 110,
            discount: 0,
            category: "Woman",
            images: ["rwein12.jpg"],
            image: "rwein12.jpg",
            description: "সম্পূর্ণ কভারেজ: নিশ্চিত ফিটিং এবং সারাদিনের আরামের জন্য সম্পূর্ণ কভারেজ কাপ।"
        },
        {
            id: 4,
            code: "P-104",
            name: "Women's Handbag",
            price: 950,
            discount: 10,
            category: "Woman",
            images: ["rwein2.jpg", "rwein3.jpg", "rwein4.jpg"],
            image: "rwein4.jpg",
            description: "Elegant women's handbag with spacious compartments and premium finish."
        },
        {
            id: 5,
            code: "P-105",
            name: "Smart Watch Strap",
            price: 250,
            discount: 5,
            category: "Accessories",
            images: ["rwein5.jpg", "rwein6.jpg", "rwein7.jpg"],
            image: "rwein5.jpg",
            description: "Durable silicone replacement strap for smartwatches."
        },
        {
            id: 6,
            code: "P-106",
            name: "Unicorn LED Lamp",
            price: 600,
            discount: 100,
            category: "Another",
            images: ["rwein8.jpg", "rwein1.jpg", "rwein2.jpg"],
            image: "rwein6.jpg",
            description: "Cute decorative night light lamp for rooms."
        },
        {
        id: 7,
        code: "P-107",
        name: "Unicorn LED Lamp",
        price: 100,
        discount: 1,
        category: "Another",
        images: ["rwein8.jpg", "rwein1.jpg", "rwein2.jpg"],
        image: "rwein6.jpg",
        description: "Cute decorative night light lamp for rooms."
        }
    ];

    let currentDetailImages = [];
    let currentImageIndex = 0;

    async function trackVisitor() {
        try {
            const response = await fetch('https://api.counterapi.dev/v2/my-github-site/page-views/up');
            const result = await response.json();
            if (result && result.data) {
                document.getElementById('visitor-count').textContent = result.data.up_count;
            } else {
                document.getElementById('visitor-count').textContent = '1';
            }
        } catch (error) {
            document.getElementById('visitor-count').textContent = 'Unavailable';
        }
    }

    function renderProducts(itemsToRender) {
        const grid = document.getElementById('productsGrid');
        if (itemsToRender.length === 0) {
            grid.innerHTML = `<div class="no-results">No products found in this selection.</div>`;
            return;
        }

        grid.innerHTML = itemsToRender.map(product => {
            const finalPrice = getDiscountedPrice(product.price, product.discount);
            const hasDiscount = product.discount && product.discount > 0;

            return `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" onclick="openDetailModal(${product.id})">
                    <div class="product-code">Code: ${product.code}</div>
                    <div class="product-title" onclick="openDetailModal(${product.id})">${product.name}</div>
                    <div class="product-price">
                        ${hasDiscount ? `
                            <span class="original-price">${product.price} BDT</span>
                            <span class="discounted-price">${finalPrice} BDT</span>
                            <span class="discount-badge">-${product.discount}%</span>
                        ` : `
                            <span>${product.price} BDT</span>
                        `}
                    </div>
                    <input type="text" class="note-input" id="note-${product.id}" placeholder="Note (Size, Color, etc.)">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
        }).join('');
    }

    function filterByCategory(category, buttonElement) {
        currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        buttonElement.classList.add('active');
        document.getElementById('searchInput').value = '';
        applyFilters();
    }

    function filterProducts() {
        applyFilters();
    }

    function applyFilters() {
        const query = document.getElementById('searchInput').value.toLowerCase().trim();
        const filtered = products.filter(product => {
            const matchesCategory = (currentCategory === 'All' || product.category === currentCategory);
            const matchesSearch = product.name.toLowerCase().includes(query) || product.code.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
        renderProducts(filtered);
    }

    function openDetailModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentDetailImages = product.images && product.images.length > 0 ? product.images : [product.image];
        currentImageIndex = 0;
        updateDetailImageDisplay();

        const finalPrice = getDiscountedPrice(product.price, product.discount);
        const hasDiscount = product.discount && product.discount > 0;

        document.getElementById('detailCode').innerText = `Code: ${product.code}`;
        document.getElementById('detailTitle').innerText = product.name;
        document.getElementById('detailPrice').innerHTML = hasDiscount ? 
            `<span class="original-price">${product.price} BDT</span> <span class="discounted-price">${finalPrice} BDT (-${product.discount}%)</span>` : 
            `${product.price} BDT`;
        document.getElementById('detailDescription').innerText = product.description || "No full description available.";
        document.getElementById('detailNoteInput').value = '';

        const btn = document.getElementById('detailAddToCartBtn');
        btn.onclick = function() {
            const noteVal = document.getElementById('detailNoteInput').value.trim();
            addToCart(product.id, noteVal);
            closeDetailModal();
        };

        document.getElementById('detailModal').classList.add('open');
    }

    function slideDetailImage(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) currentImageIndex = currentDetailImages.length - 1;
        else if (currentImageIndex >= currentDetailImages.length) currentImageIndex = 0;
        updateDetailImageDisplay();
    }

    function setDetailImage(index) {
        currentImageIndex = index;
        updateDetailImageDisplay();
    }

    function updateDetailImageDisplay() {
        document.getElementById('detailImg').src = currentDetailImages[currentImageIndex];
        const dotsContainer = document.getElementById('sliderDots');
        if (currentDetailImages.length > 1) {
            dotsContainer.innerHTML = currentDetailImages.map((_, i) => `
                <div class="dot ${i === currentImageIndex ? 'active' : ''}" onclick="setDetailImage(${i})"></div>
            `).join('');
        } else {
            dotsContainer.innerHTML = '';
        }
    }

    function closeDetailModal() {
        document.getElementById('detailModal').classList.remove('open');
    }

    function addToCart(productId, overrideNote = null) {
        const product = products.find(p => p.id === productId);
        let note = overrideNote !== null ? overrideNote : (document.getElementById(`note-${productId}`)?.value.trim() || '');
        if (overrideNote === null) {
            const inputField = document.getElementById(`note-${productId}`);
            if (inputField) inputField.value = '';
        }

        const finalPrice = getDiscountedPrice(product.price, product.discount);
        const existingIndex = cart.findIndex(item => item.id === productId && item.note === note);

        if (existingIndex > -1) {
            cart[existingIndex].qty += 1;
        } else {
            cart.push({ ...product, finalPrice: finalPrice, qty: 1, note: note });
        }

        updateCartUI();
        animateCartIcon();
    }

    function animateCartIcon() {
        const badge = document.getElementById('cartBadge');
        badge.classList.add('cart-bump');
        setTimeout(() => badge.classList.remove('cart-bump'), 200);
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        document.getElementById('cartBadge').innerText = totalItems;
        const container = document.getElementById('cartItemsContainer');
        
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty.</p>';
            document.getElementById('subtotalAmount').innerText = '0 BDT';
            document.getElementById('totalAmount').innerText = '0 BDT';
            return;
        }

        let subtotal = 0;
        container.innerHTML = cart.map((item, index) => {
            const itemTotal = item.finalPrice * item.qty;
            subtotal += itemTotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-code">Code: ${item.code}</div>
                        <div class="cart-item-title">${item.name}</div>
                        ${item.note ? `<div class="cart-item-note">Note: ${item.note}</div>` : ''}
                        <div>${item.finalPrice} BDT × ${item.qty} = ${itemTotal} BDT</div>
                    </div>
                    <div class="quantity-controls">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
            `;
        }).join('');

        const finalTotal = subtotal > 0 ? subtotal + DELIVERY_CHARGE : 0;
        document.getElementById('subtotalAmount').innerText = `${subtotal} BDT`;
        document.getElementById('totalAmount').innerText = `${finalTotal} BDT`;
    }

    function changeQty(index, delta) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) cart.splice(index, 1);
        updateCartUI();
    }

    function toggleCart() {
        document.getElementById('cartModal').classList.toggle('open');
    }

    function sendOrder(event) {
        event.preventDefault();
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const name = document.getElementById('custName').value;
        const phone = document.getElementById('custPhone').value;
        const email = document.getElementById('custEmail').value || 'Not provided';
        const address = document.getElementById('custAddress').value;

        let subtotal = 0;
        let message = `*NEW ORDER RECEIVED*\n\n*Customer Details:*\n• Name: ${name}\n• Phone: ${phone}\n• Email: ${email}\n• Address: ${address}\n\n*Order Items:*\n`;

        cart.forEach((item, index) => {
            const itemTotal = item.finalPrice * item.qty;
            subtotal += itemTotal;
            message += `${index + 1}. [${item.code}] ${item.name} (x${item.qty}) - ${itemTotal} BDT\n`;
            if (item.note) message += `   Note: ${item.note}\n`;
        });

        const grandTotal = subtotal + DELIVERY_CHARGE;
        message += `\n*Subtotal:* ${subtotal} BDT\n*Delivery Charge:* ${DELIVERY_CHARGE} BDT\n*Grand Total:* ${grandTotal} BDT`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        cart = [];
        document.getElementById('checkoutForm').reset();
        updateCartUI();
        toggleCart();
        document.getElementById('thankYouPopup').classList.add('open');
    }

    function closePopup() {
        document.getElementById('thankYouPopup').classList.remove('open');
    }

    renderProducts(products);
    trackVisitor();
