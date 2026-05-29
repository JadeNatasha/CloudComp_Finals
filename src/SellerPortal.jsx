import React, { useState, useEffect } from 'react';
import InventoryManagement from './InventoryManagement';
import LiveOrderTracking from './LiveOrderTracking';
import Analytics from './Analytics';


export default function SellerPortal({ onLogout, refreshStorefront }) {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({ totalRevenue: 0, activeOrders: 0, stockAlerts: 0 });
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const fetchInventory = () => {
  fetch('http://localhost:8000/api/inventory')
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(err => console.error("Inventory fetch error:", err));
  };

  useEffect(() => {
    // 1. Fetch Analytics
    fetch('http://localhost:8000/api/analytics')
      .then(res => res.json())
      .then(data => setAnalyticsData({
          totalRevenue: data.total_revenue || 0,
          activeOrders: data.total_orders || 0,
          stockAlerts: data.total_items_sold || 0
      }))
      .catch(err => console.error("Analytics fetch error:", err));

    // 2. Fetch Inventory (Just once!)
    fetchInventory();

    // 3. Fetch Orders
    fetch('http://localhost:8000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Orders fetch error:", err));
  }, []);

  const menuItems = ['Dashboard', 'Inventory Management', 'Live Order Tracking', 'Analytics'];
  const [newProdName, setNewProdName] = useState("");
const [newProdPrice, setNewProdPrice] = useState("");
const [newProdCat, setNewProdCat] = useState("Electronics");
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f7f7', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', background: '#2d2d2d', color: '#fff', padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#f3c1c1', marginBottom: '50px' }}>GOODNESS GRACIOUS <br/> SELLER PORTAL</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {menuItems.map((item) => (
            <div key={item} onClick={() => setActivePage(item)} style={menuStyle(activePage === item)}>
              {item}
            </div>
          ))}
        </div>
        <button onClick={onLogout} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* MAIN AREA */}
<div style={{ flex: 1, padding: '50px' }}>
  <h1 style={{ color: '#2d2d2d', marginBottom: '30px' }}>{activePage}</h1>
  
  {activePage === 'Dashboard' && (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      <div style={cardStyle}><h3>Total Revenue</h3><p style={valStyle}>₱{Number(analyticsData.totalRevenue).toLocaleString()}</p></div>
      <div style={cardStyle}><h3>Active Orders</h3><p style={valStyle}>{analyticsData.activeOrders}</p></div>
      <div style={cardStyle}><h3>Stock Alerts</h3><p style={valStyle}>{analyticsData.stockAlerts}</p></div>
    </div>
  )}

  {/* 4. Connect the components with props */}
  {activePage === 'Inventory Management' && (
  <InventoryManagement 
    inventory={inventory} 
    onAdd={() => { setEditingProduct(null); setIsAddModalOpen(true); }}
    // Pass these handlers to allow deleting and editing
    onDelete={(id) => {
      fetch(`http://localhost:8000/api/products/${id}`, { method: 'DELETE' })
        .then(() => {
          fetchInventory();      // Refresh Seller View
          if (window.refreshStorefront) window.refreshStorefront(); // Refresh Storefront
        })
        .catch(err => console.error("Delete error:", err));
    }}
 
    onEdit={(item) => {
      setEditingProduct(item);   // Save the item data
      setNewProdName(item.name); // <--- Add this!
      setNewProdPrice(item.price); // <--- Add this!
      setNewProdCat(item.category); // <--- Add this!
      setIsAddModalOpen(true);    // Open the modal
    }}
  />
  
)}
  {activePage === 'Live Order Tracking' && <LiveOrderTracking orders={orders} />}
  
  {/* Updated Analytics section using the new component */}
  {activePage === 'Analytics' && <Analytics data={analyticsData} />}
  
  {/* MODAL */}
        {isAddModalOpen && (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle}>
      <h3>{editingProduct ? "Edit Product Definition" : "Add New Product Definition"}</h3>
      
      <label style={labelStyle}>PRODUCT TITLE NAME</label>
      <input 
        defaultValue={editingProduct?.name || ""} // If editing, show the name
        placeholder="e.g., Silk Summer Scarf" 
        style={inputStyle} 
        onChange={(e) => setNewProdName(e.target.value)} 
      />
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>CATEGORY PLACEMENT</label>
          <select style={inputStyle} onChange={(e) => setNewProdCat(e.target.value)}>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Living</option>
            <option>Beauty</option>
            <option>Sports</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>UNIT VALUATION PRICE (PHP)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            style={inputStyle} 
            onChange={(e) => setNewProdPrice(e.target.value)}
          />
        </div>
      </div>

        
      <div style={buttonGroupStyle}>
              <button style={discardButtonStyle} onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null); // Keep this to ensure a fresh form next time
                }}>Discard</button>
              <button style={deployButtonStyle} onClick={() => {
                const payload = { name: newProdName, price: parseFloat(newProdPrice), category: newProdCat, stock: 10 };
                const url = editingProduct ? `http://localhost:8000/api/products/${editingProduct.id}` : 'http://localhost:8000/api/products';
                const method = editingProduct ? 'PUT' : 'POST';
                
                fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  .then(() => { 
    // 1. Refresh Seller Inventory
    fetchInventory(); 
    
    // 2. TRIGGER THE SYNC!
    return fetch('http://localhost:8000/api/trigger-etl', { method: 'POST' });
  })
  .then(() => {
      console.log("Database synced to Storefront!");
      
      // 3. Immediately refresh the Storefront UI!
     if (window.refreshStorefront) {
          window.refreshStorefront();
      }

      // Close modal and reset state ONLY after everything else is confirmed
      setIsAddModalOpen(false); 
      setEditingProduct(null); 
  })
  .catch(err => {
      console.error("Sync failed:", err);
      // Even if it fails, we might want to close the modal or alert the user
      setIsAddModalOpen(false);
  });
              }}>
                {editingProduct ? "Update Listing" : "Deploy Listing"}
              </button>
            </div>
    </div>
  </div>
)}
  
</div>
    </div>
  );
}

const menuStyle = (isActive) => ({
  cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#fff' : '#ccc',
  padding: '10px', borderRadius: '5px', background: isActive ? '#3d3d3d' : 'transparent'
});
const sidebarStyle = { width: '280px', background: '#2d2d2d', color: '#fff', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' };
const logoutButtonStyle = { marginTop: 'auto', background: 'transparent', border: '1px solid #f3c1c1', color: '#f3c1c1', padding: '10px', cursor: 'pointer', borderRadius: '5px', width: '80%' };
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const valStyle = { fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0 0 0', color: '#2d2d2d' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };

// NEW UPDATED STYLES
const modalContentStyle = { background: '#fff', padding: '40px', borderRadius: '15px', width: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #cbd5e0', boxSizing: 'border-box' };
const labelStyle = { fontSize: '0.75rem', fontWeight: 'bold', color: '#4a5568', marginTop: '15px', display: 'block', textTransform: 'uppercase' };
const buttonGroupStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' };
const discardButtonStyle = { padding: '10px 25px', borderRadius: '8px', border: '1px solid #cbd5e0', background: 'transparent', cursor: 'pointer' };
const deployButtonStyle = { padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#2d3748', color: '#fff', cursor: 'pointer' };