// Base Synchronization Products Data Store Array
let merchantInventoryBook = [
    { id: 1, title: 'Retro Sunglasses', price: 1750.00, category: 'accessories', icon: 'fa-glasses' },
    { id: 2, title: 'Minimalist Chrono Watch', price: 5500.00, category: 'accessories', icon: 'fa-stopwatch' },
    { id: 3, title: 'Linen Casual Shirt', price: 2250.00, category: 'apparel', icon: 'fa-shirt' },
    { id: 4, title: 'Classic Denim Jacket', price: 4250.00, category: 'apparel', icon: 'fa-vest-patches' },
    { id: 5, title: 'Suede Urban Sneakers', price: 4750.00, category: 'footwear', icon: 'fa-shoe-prints' },
    { id: 6, title: 'Velvet Matte Lipstick', price: 1100.00, category: 'cosmetics', icon: 'fa-wand-magic-sparkles' }
];

// Live Incoming Transaction Processing Records Array Tracker
let inboundOrdersLog = [
    {
        orderId: "GG-98431-MN",
        date: "May 24, 2026",
        customer: "Jane Doe",
        shippingDetails: "123 Harmony Street, Brgy. Lifestyle, Cagayan de Oro City",
        status: "transit",
        statusText: "In Transit",
        items: [
            { title: "Retro Sunglasses", quantity: 1, price: 1750.00 },
            { title: "Linen Casual Shirt", quantity: 2, price: 2250.00 }
        ],
        totalAmount: 6250.00
    },
    {
        orderId: "GG-10492-CDO",
        date: "April 18, 2026",
        customer: "Jane Doe",
        shippingDetails: "123 Harmony Street, Brgy. Lifestyle, Cagayan de Oro City",
        status: "delivered",
        statusText: "Delivered",
        items: [
            { title: "Minimalist Chrono Watch", quantity: 1, price: 5500.00 }
        ],
        totalAmount: 5500.00
    }
];

document.addEventListener('DOMContentLoaded', () => {
    refreshWorkspaceCalculatedStats();
    renderInventoryRegistryTable(merchantInventoryBook);
    renderMasterOrdersLogTable();
});

// Tab Routing Controller Matrix
function switchAdminTab(tabKey, clickEvent) {
    document.querySelectorAll('.admin-tab-view').forEach(view => view.classList.add('hidden'));
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));
    
    const title = document.getElementById('adminTabTitle');
    const subtitle = document.getElementById('adminTabSubtitle');
    
    if (tabKey === 'dashboard') {
        document.getElementById('adminTabDashboard').classList.remove('hidden');
        title.innerText = "Dashboard Overview";
        subtitle.innerText = "Real-time store performance analytics and operational trackers.";
        refreshWorkspaceCalculatedStats();
    } else if (tabKey === 'inventory') {
        document.getElementById('adminTabInventory').classList.remove('hidden');
        title.innerText = "Inventory Registry";
        subtitle.innerText = "Manage active catalog listings, customize pricing structures, and update records.";
        renderInventoryRegistryTable(merchantInventoryBook);
    } else if (tabKey === 'orders') {
        document.getElementById('adminTabOrders').classList.remove('hidden');
        title.innerText = "Live Orders Log";
        subtitle.innerText = "Monitor client payments, process pending packages, and log delivery dispatches.";
        renderMasterOrdersLogTable();
    }
    
    if (clickEvent) {
        clickEvent.currentTarget.classList.add('active');
    }
}

// Cross-linking utility function
function triggerTabLink(tabKey) {
    const matchedBtn = Array.from(document.querySelectorAll('.menu-item')).find(btn => btn.innerText.toLowerCase().includes(tabKey));
    if (matchedBtn) matchedBtn.click();
}

// METRICS BALANCER ENGINE: Recalculates metrics live
function refreshWorkspaceCalculatedStats() {
    // 1. Calculate Gross Sales
    const totalSales = inboundOrdersLog
        .filter(ord => ord.status !== 'cancelled')
        .reduce((sum, current) => sum + current.totalAmount, 0);
    
    document.getElementById('statGrossSales').innerText = `₱${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    
    // 2. Counts
    document.getElementById('statOrdersCount').innerText = inboundOrdersLog.length;
    document.getElementById('statProductsCount').innerText = merchantInventoryBook.length;
    
    // 3. Mini Dashboard Preview Queue
    const previewContainer = document.getElementById('dashboardPendingOrdersPreview');
    if (!previewContainer) return;
    previewContainer.innerHTML = '';
    
    const pendingShipments = inboundOrdersLog.filter(ord => ord.status === 'transit');
    
    if (pendingShipments.length === 0) {
        previewContainer.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No pending shipments require packing attention.</td></tr>`;
        return;
    }
    
    pendingShipments.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-family:monospace; font-weight:600;">#${order.orderId}</td>
            <td>${order.customer}</td>
            <strong><td>₱${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></strong>
            <td><span class="status-row-badge transit"><i class="fa-solid fa-truck-fast"></i> Processing</span></td>
        `;
        previewContainer.appendChild(row);
    });
}

// INVENTORY MANAGEMENT VIEW RENDERING
function renderInventoryRegistryTable(productsDataset) {
    const tableBody = document.getElementById('inventoryTableRegistryBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (productsDataset.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">No product entities match your search parameters.</td></tr>`;
        return;
    }

    productsDataset.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="table-product-cell">
                    <div class="table-icon-avatar"><i class="fa-solid ${product.icon || 'fa-tag'}"></i></div>
                    <strong><span style="color:var(--admin-navy); font-weight:600;">${product.title}</span></strong>
                </div>
            </td>
            <td><span class="table-category-tag">${product.category}</span></td>
            <td><strong>₱${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            <td><span class="visibility-pill active"><i class="fa-solid fa-circle-check"></i> Live On Store</span></td>
            <td>
                <div class="table-row-actions-group">
                    <button type="button" class="row-control-btn edit" title="Modify Details" onclick="openProductCrudModal('edit', ${product.id})">
                        <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="row-control-btn delete" title="Remove Item" onclick="deleteInventoryItem(${product.id})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.innerHTML += row.outerHTML;
    });
}

function filterInventoryGrid() {
    const keyword = document.getElementById('inventorySearchBox').value.toLowerCase().trim();
    const matchedFilteredResults = merchantInventoryBook.filter(prod => 
        prod.title.toLowerCase().includes(keyword) || 
        prod.category.toLowerCase().includes(keyword)
    );
    renderInventoryRegistryTable(matchedFilteredResults);
}

// INVENTORY CRUD DIALOG CONTROL INTERACTION HANDLERS
function openProductCrudModal(mode, productId) {
    const modal = document.getElementById('productCrudModal');
    const formTitle = document.getElementById('modalCrudTitle');
    const submitBtn = document.getElementById('crudSubmitFormActionButton');
    
    modal.classList.add('show');
    
    if (mode === 'create') {
        formTitle.innerText = "Add New Product Definition";
        submitBtn.innerText = "Deploy Listing";
        document.getElementById('productCrudForm').reset();
        document.getElementById('crudProductIdHidden').value = '';
    } else if (mode === 'edit') {
        formTitle.innerText = "Modify Existing Product Properties";
        submitBtn.innerText = "Save Adjustments";
        
        const matchedItem = merchantInventoryBook.find(p => p.id === productId);
        if (matchedItem) {
            document.getElementById('crudProductIdHidden').value = matchedItem.id;
            document.getElementById('crudTitle').value = matchedItem.title;
            document.getElementById('crudCategory').value = matchedItem.category;
            document.getElementById('crudPrice').value = matchedItem.price;
            document.getElementById('crudIcon').value = matchedItem.icon || 'fa-tag';
        }
    }
}

function closeProductCrudModal() {
    document.getElementById('productCrudModal').classList.remove('show');
    document.getElementById('productCrudForm').reset();
}

function handleProductCrudSubmit(event) {
    event.preventDefault();
    
    const hiddenIdValue = document.getElementById('crudProductIdHidden').value;
    const title = document.getElementById('crudTitle').value;
    const category = document.getElementById('crudCategory').value;
    const price = parseFloat(document.getElementById('crudPrice').value);
    const icon = document.getElementById('crudIcon').value;

    if (hiddenIdValue) {
        // Edit Action Loop
        const targetId = parseInt(hiddenIdValue);
        const itemIndex = merchantInventoryBook.findIndex(p => p.id === targetId);
        if (itemIndex > -1) {
            merchantInventoryBook[itemIndex] = { id: targetId, title, price, category, icon };
        }
    } else {
        // Create Action Loop
        const freshListing = {
            id: Date.now(),
            title,
            price,
            category,
            icon
        };
        merchantInventoryBook.push(freshListing);
    }

    renderInventoryRegistryTable(merchantInventoryBook);
    closeProductCrudModal();
}

function deleteInventoryItem(productId) {
    if (confirm("Are you sure you want to permanently withdraw this product listing from storage metrics?")) {
        merchantInventoryBook = merchantInventoryBook.filter(p => p.id !== productId);
        renderInventoryRegistryTable(merchantInventoryBook);
    }
}

// LIVE ORDERS MASTER LOG TABLE RENDERING
function renderMasterOrdersLogTable() {
    const tableBody = document.getElementById('ordersMasterTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    inboundOrdersLog.forEach(order => {
        let itemsSummaryHTML = '<ul class="ordered-items-summary-list">';
        order.items.forEach(itm => {
            itemsSummaryHTML += `<li>• <strong>${itm.quantity}x</strong> ${itm.title}</li>`;
        });
        itemsSummaryHTML += '</ul>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-family:monospace; font-weight:600; color:var(--admin-navy);">#${order.orderId}</td>
            <td>${order.date}</td>
            <td>
                <div style="font-weight:600; margin-bottom:2px;">${order.customer}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); max-width:220px; line-height:1.3;">${order.shippingDetails}</div>
            </td>
            <td>${itemsSummaryHTML}</td>
            <td><strong>₱${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></td>
            <td>
                <span class="status-row-badge ${order.status}">
                    <i class="fa-solid ${order.status === 'delivered' ? 'fa-circle-check' : 'fa-truck-fast'}"></i> ${order.statusText}
                </span>
            </td>
            <td style="text-align: center;">
                ${order.status === 'transit' ? `
                    <button class="fulfillment-action-btn ship" onclick="shipPendingOrder('${order.orderId}')">
                        <i class="fa-solid fa-box-open"></i> Ship Order
                    </button>
                ` : `
                    <span style="font-size:0.8rem; color:var(--text-muted); font-weight:500;"><i class="fa-solid fa-check-double"></i> Complete</span>
                `}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// LIVE ORDER DISPATCH ACTION CONTROLLER
function shipPendingOrder(orderId) {
    const matchedOrder = inboundOrdersLog.find(ord => ord.orderId === orderId);
    if (matchedOrder) {
        matchedOrder.status = 'delivered';
        matchedOrder.statusText = 'Delivered';
        alert(`Order reference ${orderId} status changed successfully to Dispatched/Delivered!`);
        renderMasterOrdersLogTable();
    }
}

function exitToCustomerStorefront() {
    window.location.href = 'index.html';
}