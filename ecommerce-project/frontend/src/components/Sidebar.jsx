import React from 'react';

export default function Sidebar({ role, setRole, view, setView, cartCount }) {
  return (
    <aside className="store-sidebar">
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '20px', margin: '0 0 10px 0' }}>EJMShopSmart</h2>
        
        <div className="role-matrix-box">
          <button 
            onClick={() => { setRole('customer'); setView('dashboard'); }}
            className={`role-btn ${role === 'customer' ? 'active' : ''}`}
          >
            Customer UI
          </button>
          <button 
            onClick={() => { setRole('manager'); setView('dashboard'); }}
            className={`role-btn ${role === 'manager' ? 'active' : ''}`}
          >
            Manager DB
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => setView('dashboard')}
            className={`nav-link-btn ${view === 'dashboard' ? 'active' : ''}`}
          >
            🏠 Products
          </button>
          
          {role === 'customer' && (
            <button 
              onClick={() => setView('cart')}
              className={`nav-link-btn ${view === 'cart' ? 'active' : ''}`}
            >
              🛒 Your Cart ({cartCount})
            </button>
          )}

          {role === 'manager' && (
            <button 
              onClick={() => setView('sales')}
              className={`nav-link-btn ${view === 'sales' ? 'active' : ''}`}
            >
              📊 Inventory
            </button>
          )}
        </nav>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: 'auto' }}>
        <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>Logged in as:</div>
        <div style={{ fontWeight: 'bold', color: '#DDA15E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>
          👤 {role} Mode
        </div>
        <button style={{ background: 'none', border: 'none', color: 'white', opacity: '0.6', cursor: 'pointer', padding: 0, fontSize: '14px' }}>Logout</button>
      </div>
    </aside>
  );
}