let currentCustomerState = 'login'; 
let currentRoleView = 'customer';   

// Base Products Catalog
const catalogProducts = [
    { id: 1, title: 'Retro Sunglasses', price: 1750.00, category: 'accessories', icon: 'fa-glasses' },
    { id: 2, title: 'Minimalist Chrono Watch', price: 5500.00, category: 'accessories', icon: 'fa-stopwatch' },
    { id: 3, title: 'Linen Casual Shirt', price: 2250.00, category: 'apparel', icon: 'fa-shirt' },
    { id: 4, title: 'Classic Denim Jacket', price: 4250.00, category: 'apparel', icon: 'fa-vest-patches' },
    { id: 5, title: 'Suede Urban Sneakers', price: 4750.00, category: 'footwear', icon: 'fa-shoe-prints' },
    { id: 6, title: 'Velvet Matte Lipstick', price: 1100.00, category: 'cosmetics', icon: 'fa-wand-magic-sparkles' }
];

// Interactive Shipping Address Ledger State Collection
let shippingAddressBook = [
    {
        id: 1,
        label: "Home / Primary Address",
        receiver: "Jane Doe",
        phone: "+63 917 123 4567",
        details: "123 Harmony Street, Brgy. Lifestyle",
        city: "Cagayan de Oro City",
        zip: "9000",
        isDefault: true
    },
    {
        id: 2,
        label: "Office",
        receiver: "Jane Doe (GoodnessGracious Corporate HQ)",
        phone: "+63 905 555 7890",
        details: "Floor 14, Highrise Tech Tower, Business Avenue",
        city: "Makati City",
        zip: "1226",
        isDefault: false
    }
];

// Mock Transaction History Tracking Record System Array
let trackOrdersRecord = [
    {
        orderId: "GG-98431-MN",
        date: "May 24, 2026",
        status: "transit",
        statusText: "In Transit",
        items: [
            { title: "Retro Sunglasses", quantity: 1, price: 1750.00, icon: "fa-glasses" },
            { title: "Linen Casual Shirt", quantity: 2, price: 2250.00, icon: "fa-shirt" }
        ],
        totalAmount: 6250.00
    },
    {
        orderId: "GG-10492-CDO",
        date: "April 18, 2026",
        status: "delivered",
        statusText: "Delivered",
        items: [
            { title: "Minimalist Chrono Watch", quantity: 1, price: 5500.00, icon: "fa-stopwatch" }
        ],
        totalAmount: 5500.00
    }
];

let shoppingCart = [];
let wishlistSet = new Set();

document.addEventListener('DOMContentLoaded', () => {
    renderStorefrontProducts('all');
    renderOrdersHistoryLog();
    renderAddressesLedger();

    // Global listener to shut open dropdown layers automatically
    window.addEventListener('click', () => {
        const dropdown = document.getElementById('profileDropdown');
        const container = document.querySelector('.profile-container');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            container.classList.remove('open-menu');
        }
    });
});

// App View Routing Matrix System
function navigateToTab(targetTabId) {
    document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
    
    if (targetTabId === 'catalog') {
        document.getElementById('tabCatalog').classList.remove('hidden');
    } else if (targetTabId === 'profile') {
        document.getElementById('tabProfile').classList.remove('hidden');
        renderAddressesLedger();
    } else if (targetTabId === 'orders') {
        document.getElementById('tabOrders').classList.remove('hidden');
        renderOrdersHistoryLog();
    }
    
    const dropdown = document.getElementById('profileDropdown');
    const container = document.querySelector('.profile-container');
    if(dropdown) dropdown.classList.remove('show');
    if(container) container.classList.remove('open-menu');
}

function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profileDropdown');
    const container = document.querySelector('.profile-container');
    
    dropdown.classList.toggle('show');
    container.classList.toggle('open-menu');
}

// PROFILE RE-ENGINEERING SUBMITTER
function saveProfileChanges(event) {
    event.preventDefault();
    
    const updatedName = document.getElementById('profName').value;
    const updatedEmail = document.getElementById('profEmail').value;
    const leadingChar = updatedName.trim().charAt(0).toUpperCase() || 'U';

    document.getElementById('navDisplayName').innerText = updatedName;
    document.getElementById('navAvatar').innerText = leadingChar;
    document.getElementById('dropdownName').innerText = updatedName;
    document.getElementById('dropdownEmail').innerText = updatedEmail;
    document.getElementById('profileSummaryName').innerText = updatedName;
    document.getElementById('profileSummaryEmail').innerText = updatedEmail;
    document.getElementById('profileBigAvatar').innerText = leadingChar;

    alert('Your profile adjustments have been successfully recorded!');
}

// ADDRESS LEDGER MODULE: Render collection list stack items with active click bindings
function renderAddressesLedger() {
    const container = document.getElementById('addressBookContainer');
    if (!container) return;
    container.innerHTML = '';

    shippingAddressBook.forEach(address => {
        const itemCard = document.createElement('div');
        itemCard.className = `address-ledger-item ${address.isDefault ? 'is-default' : ''}`;
        
        // Dynamic target trigger ensures clicking card changes default designation
        itemCard.addEventListener('click', (e) => {
            if (!e.target.closest('.addr-action-icon') && !address.isDefault) {
                selectDefaultAddress(address.id);
            }
        });
        
        itemCard.innerHTML = `
            <div class="address-info-block">
                <div class="addr-title-line">
                    <h4>${address.label}</h4>
                    ${address.isDefault ? '<span class="default-pill-tag">Default</span>' : ''}
                </div>
                <div class="addr-body-text">
                    <strong>${address.receiver}</strong> — ${address.details}, ${address.city}, ${address.zip}
                </div>
                <div class="addr-phone-text"><i class="fa-solid fa-phone fa-xs"></i> ${address.phone}</div>
            </div>
            <div class="address-actions-block">
                <button type="button" class="addr-action-icon" title="Delete Address" onclick="deleteAddressItem(${address.id})">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
        container.appendChild(itemCard);
    });
}

// Interactive Toggle Handler: Swaps primary address data records
function selectDefaultAddress(addressId) {
    shippingAddressBook.forEach(addr => {
        addr.isDefault = (addr.id === addressId);
    });
    renderAddressesLedger();
}

function openAddressModal() {
    document.getElementById('addressModal').classList.add('show');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.remove('show');
    document.getElementById('addressEntryForm').reset();
}

function handleNewAddressSubmit(event) {
    event.preventDefault();
    
    const label = document.getElementById('addrLabel').value;
    const receiver = document.getElementById('addrReceiver').value;
    const phone = document.getElementById('addrPhone').value;
    const details = document.getElementById('addrDetails').value;
    const city = document.getElementById('addrCity').value;
    const zip = document.getElementById('addrZip').value;
    const makeDefault = document.getElementById('addrDefaultCheck').checked;

    if (makeDefault) {
        shippingAddressBook.forEach(addr => addr.isDefault = false);
    }

    const freshAddress = {
        id: Date.now(),
        label,
        receiver,
        phone,
        details,
        city,
        zip,
        isDefault: makeDefault || shippingAddressBook.length === 0
    };

    shippingAddressBook.push(freshAddress);
    renderAddressesLedger();
    closeAddressModal();
}

function deleteAddressItem(addressId) {
    const targetIndex = shippingAddressBook.findIndex(addr => addr.id === addressId);
    if (targetIndex > -1) {
        const wasDefault = shippingAddressBook[targetIndex].isDefault;
        shippingAddressBook.splice(targetIndex, 1);
        
        if (wasDefault && shippingAddressBook.length > 0) {
            shippingAddressBook[0].isDefault = true;
        }
        renderAddressesLedger();
    }
}

// ORDER ENGINE LOOPER: Renders running logs
function renderOrdersHistoryLog() {
    const trackingContainer = document.getElementById('ordersListContainer');
    if(!trackingContainer) return;
    trackingContainer.innerHTML = '';

    if (trackOrdersRecord.length === 0) {
        trackingContainer.innerHTML = `
            <div class="profile-dashboard-card" style="text-align:center; padding:50px 20px; color:var(--text-muted);">
                <i class="fa-solid fa-box-open fa-3x" style="margin-bottom:15px; opacity:0.4;"></i>
                <p>No recorded orders were found on this account statement history link.</p>
            </div>`;
        return;
    }

    trackOrdersRecord.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-history-card';
        
        let itemsHTML = '';
        order.items.forEach(prod => {
            itemsHTML += `
                <div class="order-embedded-product-row">
                    <div class="order-product-left">
                        <div class="order-product-icon-box"><i class="fa-solid ${prod.icon || 'fa-bag-shopping'}"></i></div>
                        <div class="order-product-meta-desc">
                            <div class="prod-name">${prod.title}</div>
                            <div class="prod-qty">Quantity: ${prod.quantity}</div>
                        </div>
                    </div>
                    <div class="order-product-price-right">₱${(prod.price * prod.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                </div>`;
        });

        orderCard.innerHTML = `
            <div class="order-card-meta-header">
                <div class="meta-details-cluster">
                    <div class="meta-item"><span>Order Placed</span><span>${order.date}</span></div>
                    <div class="meta-item"><span>Total Statement</span><span>₱${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
                    <div class="meta-item"><span>ID Reference</span><span style="color:var(--text-muted); font-family:monospace;">#${order.orderId}</span></div>
                </div>
                <div class="order-status-badge ${order.status}">
                    <i class="fa-solid ${order.status === 'delivered' ? 'fa-circle-check' : 'fa-truck-fast'}"></i> ${order.statusText}
                </div>
            </div>
            <div class="order-card-items-body">
                ${itemsHTML}
            </div>
        `;
        trackingContainer.appendChild(orderCard);
    });
}

// CHECKOUT BRIDGE SYSTEM
function triggerMockCheckout() {
    if (shoppingCart.length === 0) {
        alert("Your shopping basket is empty!");
        return;
    }

    let calculationTotal = 0;
    const checkoutItemsMapped = shoppingCart.map(cartItem => {
        calculationTotal += (cartItem.product.price * cartItem.quantity);
        return {
            title: cartItem.product.title,
            quantity: cartItem.quantity,
            price: cartItem.product.price,
            icon: cartItem.product.icon
        };
    });

    const randomizedId = `GG-${Math.floor(10000 + Math.random() * 90000)}-MNL`;
    const formattingDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const freshOrderObject = {
        orderId: randomizedId,
        date: formattingDate,
        status: "transit",
        statusText: "Processing Delivery",
        items: checkoutItemsMapped,
        totalAmount: calculationTotal
    };

    trackOrdersRecord.unshift(freshOrderObject);
    shoppingCart = [];
    updateCartDOM();
    closeAllPanels();

    alert('Thank you! Your order was placed successfully. Redirecting to transaction tracking records panel.');
    navigateToTab('orders');
}

// CATALOG RENDERING MATRIX
function renderStorefrontProducts(filterType) {
    const grid = document.getElementById('storefrontGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const viewableProducts = filterType === 'all' 
        ? catalogProducts 
        : catalogProducts.filter(p => p.category === filterType);

    viewableProducts.forEach(product => {
        const isLiked = wishlistSet.has(product.id) ? 'liked' : '';
        const heartIcon = wishlistSet.has(product.id) ? 'fa-solid' : 'fa-regular';
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-container">
                <i class="fa-regular fa-image fa-3x placeholder-icon"></i>
                <span class="item-type-tag"><i class="fa-solid ${product.icon}"></i> ${product.category}</span>
                <div class="wishlist-badge-pos">
                    <button class="action-icon-btn ${isLiked}" onclick="toggleWishlistItem(${product.id})">
                        <i class="${heartIcon} fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-price">₱${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <button class="product-text-add-btn" onclick="addCartItem(${product.id})">
                    <i class="fa-solid fa-basket-shopping"></i> Add to Cart
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterCategory(categoryName) {
    navigateToTab('catalog');
    document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    renderStorefrontProducts(categoryName);
}

function toggleSlidePanel(panelId) {
    const targetPanel = document.getElementById(panelId);
    const overlay = document.getElementById('panelOverlay');
    
    if (targetPanel.classList.contains('open')) {
        targetPanel.classList.remove('open');
        overlay.classList.remove('active');
    } else {
        closeAllPanels();
        targetPanel.classList.add('open');
        overlay.classList.add('active');
    }
}

function closeAllPanels() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('wishlistPanel').classList.remove('open');
    document.getElementById('panelOverlay').classList.remove('active');
}

function addCartItem(id) {
    const existingCartItem = shoppingCart.find(item => item.product.id === id);
    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        const matchedProduct = catalogProducts.find(p => p.id === id);
        shoppingCart.push({ product: matchedProduct, quantity: 1 });
    }
    updateCartDOM();
}

function adjustQty(index, amount) {
    shoppingCart[index].quantity += amount;
    if (shoppingCart[index].quantity <= 0) {
        shoppingCart.splice(index, 1);
    }
    updateCartDOM();
}

function removeCartItem(index) {
    shoppingCart.splice(index, 1);
    updateCartDOM();
}

function updateCartDOM() {
    const totalItemCount = shoppingCart.reduce((acc, current) => acc + current.quantity, 0);
    document.getElementById('cartCount').innerText = totalItemCount;
    document.getElementById('cartHeaderCount').innerText = totalItemCount;
    
    const container = document.getElementById('cartPanelItems');
    if(!container) return;
    container.innerHTML = '';
    
    if(shoppingCart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-basket-shopping fa-3x"></i>
                <p>Your shopping cart is currently empty.</p>
            </div>`;
        document.getElementById('cartSubtotal').innerText = '₱0.00';
        return;
    }
    
    let calculationTotal = 0;
    shoppingCart.forEach((item, index) => {
        const itemSubtotal = item.product.price * item.quantity;
        calculationTotal += itemSubtotal;
        
        const row = document.createElement('div');
        row.className = 'drawer-item';
        row.innerHTML = `
            <div class="drawer-item-img"><i class="fa-regular fa-image fa-xl"></i></div>
            <div class="drawer-item-details">
                <div class="drawer-item-name">${item.product.title}</div>
                <div class="drawer-item-price">₱${item.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div class="quantity-adjustment-engine">
                    <button class="qty-step-btn" onclick="adjustQty(${index}, -1)"><i class="fa-solid fa-minus"></i></button>
                    <div class="qty-display-box">${item.quantity}</div>
                    <button class="qty-step-btn" onclick="adjustQty(${index}, 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash-can"></i></button>
        `;
        container.appendChild(row);
    });
    
    document.getElementById('cartSubtotal').innerText = `₱${calculationTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toggleWishlistItem(id) {
    if(wishlistSet.has(id)) {
        wishlistSet.delete(id);
    } else {
        wishlistSet.add(id);
    }
    document.getElementById('wishlistCount').innerText = wishlistSet.size;
    
    const activePill = document.querySelector('.category-pill.active');
    const runningFilter = (activePill && activePill.innerText.toLowerCase().includes('all')) ? 'all' : activePill.innerText.toLowerCase().split(' ').pop();
    renderStorefrontProducts(runningFilter || 'all');
    updateWishlistDOM();
}

function updateWishlistDOM() {
    const container = document.getElementById('wishlistPanelItems');
    if(!container) return;
    container.innerHTML = '';
    
    if(wishlistSet.size === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-heart fa-3x"></i>
                <p>You haven't added favorites yet.</p>
            </div>`;
        return;
    }
    
    wishlistSet.forEach(id => {
        const item = catalogProducts.find(p => p.id === id);
        const row = document.createElement('div');
        row.className = 'drawer-item';
        row.innerHTML = `
            <div class="drawer-item-img"><i class="fa-regular fa-image fa-xl"></i></div>
            <div class="drawer-item-details">
                <div class="drawer-item-name">${item.title}</div>
                <div class="drawer-item-price">₱${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <button class="remove-item-btn" onclick="toggleWishlistItem(${item.id})"><i class="fa-solid fa-heart-crack"></i></button>
        `;
        container.appendChild(row);
    });
}

// SECURITY VISUAL MATRIX GATEWAY SWITCHER
function toggleCustomerAuthMode() {
    const sideTitle = document.getElementById('sidePanelTitle');
    const sideDesc = document.getElementById('sidePanelDesc');
    const sideBtn = document.getElementById('sidePanelBtn');
    const loginUI = document.getElementById('customerLoginUI');
    const signUpUI = document.getElementById('customerSignUpUI');
    const adminUI = document.getElementById('adminPortalUI');

    if (currentRoleView === 'admin') {
        currentRoleView = 'customer';
        adminUI.classList.add('hidden');
    }

    if (currentCustomerState === 'login') {
        currentCustomerState = 'signup';
        sideTitle.innerText = "Already Registered?";
        sideDesc.innerText = "Log back into your account dashboard here.";
        sideBtn.innerText = "Log In";
        
        loginUI.classList.add('hidden');
        signUpUI.classList.remove('hidden');
    } else {
        currentCustomerState = 'login';
        sideTitle.innerText = "New here?";
        sideDesc.innerText = "Sign up now to start tracking your orders and shopping smart!";
        sideBtn.innerText = "Sign Up";
        
        signUpUI.classList.add('hidden');
        loginUI.classList.remove('hidden');
    }
}

function switchRoleView(targetRole) {
    const loginUI = document.getElementById('customerLoginUI');
    const signUpUI = document.getElementById('customerSignUpUI');
    const adminUI = document.getElementById('adminPortalUI');
    const sideTitle = document.getElementById('sidePanelTitle');
    const sideDesc = document.getElementById('sidePanelDesc');
    const sideBtn = document.getElementById('sidePanelBtn');

    currentRoleView = targetRole;

    if (targetRole === 'admin') {
        loginUI.classList.add('hidden');
        signUpUI.classList.add('hidden');
        adminUI.classList.remove('hidden');

        sideTitle.innerText = "Store Accounts";
        sideDesc.innerText = "Need to register a consumer account instead?";
        sideBtn.innerText = "Sign Up";
        currentCustomerState = 'login';
    } else {
        adminUI.classList.add('hidden');
        loginUI.classList.remove('hidden');

        sideTitle.innerText = "New here?";
        sideDesc.innerText = "Sign up now to start tracking your orders and shopping smart!";
        sideBtn.innerText = "Sign Up";
        currentCustomerState = 'login';
    }
}

function handleAuthSubmit(event, platformRole) {
    event.preventDefault();
    if (platformRole === 'admin') {
        window.location.href = 'admin.html';
    } else {
        const insertedMail = document.getElementById('loginEmail').value;
        if(insertedMail) {
            document.getElementById('dropdownEmail').innerText = insertedMail;
            document.getElementById('profileSummaryEmail').innerText = insertedMail;
            document.getElementById('profEmail').value = insertedMail;
        }
        
        document.getElementById('authModule').style.display = 'none';
        document.getElementById('customerStorefrontView').style.display = 'block';
        navigateToTab('catalog');
    }
}

function exitToAuthScreen() {
    closeAllPanels();
    document.getElementById('customerStorefrontView').style.display = 'none';
    document.getElementById('authModule').style.display = 'flex';
    switchRoleView('customer');
}