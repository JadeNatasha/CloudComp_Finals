import React, { useState, useEffect } from 'react';
import InventoryManagement from './InventoryManagement';
import LiveOrderTracking from './LiveOrderTracking';
import Analytics from './Analytics';

export default function SellerPortal({ onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard');
  const [analyticsData, setAnalyticsData] = useState({ totalRevenue: 0, activeOrders: 0, stockAlerts: 0 });
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

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

    // 2. Updated Fetch with Error Handling
    fetch('http://localhost:8000/api/inventory')
      .then(res => res.json())
      .then(data => setInventory(data))
      .catch(err => console.error("Inventory fetch error:", err));

    fetch('http://localhost:8000/api/orders')
      .then(res => res.json())
      .then(data => {
        console.log("Orders received:", data); // THIS WILL HELP US DEBUG
        setOrders(data);
      })
      .catch(err => console.error("Orders fetch error:", err));
  }, []);

  const menuItems = ['Dashboard', 'Inventory Management', 'Live Order Tracking', 'Analytics'];

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
  {activePage === 'Inventory Management' && <InventoryManagement inventory={inventory} />}
  {activePage === 'Live Order Tracking' && <LiveOrderTracking orders={orders} />}
  
  {/* Updated Analytics section using the new component */}
  {activePage === 'Analytics' && <Analytics data={analyticsData} />}
</div>
    </div>
  );
}

const menuStyle = (isActive) => ({
  cursor: 'pointer', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#fff' : '#ccc',
  padding: '10px', borderRadius: '5px', background: isActive ? '#3d3d3d' : 'transparent'
});
const cardStyle = { background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #e0e0e0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const valStyle = { fontSize: '1.8rem', fontWeight: 'bold', margin: '10px 0 0 0', color: '#2d2d2d' };
const logoutButtonStyle = { marginTop: 'auto', background: 'transparent', border: '1px solid #f3c1c1', color: '#f3c1c1', padding: '10px', cursor: 'pointer', borderRadius: '5px' };