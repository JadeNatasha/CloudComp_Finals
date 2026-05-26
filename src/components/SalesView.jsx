import React from 'react';

export default function SalesView({ products, totalUniqueItems, totalStockInStore, lowStockItems }) {
  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>📊 Inventory Management</h1>
      
      <div className="stat-row">
        <div className="stat-card">
          <div style={{ fontSize: '14px', color: '#8A766A', marginBottom: '5px' }}>Total Distinct SKUs</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#634832' }}>{totalUniqueItems} Items</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '14px', color: '#8A766A', marginBottom: '5px' }}>Gross Warehouse Stock</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#634832' }}>{totalStockInStore} Units</div>
        </div>
        <div className="stat-card" style={{ backgroundColor: '#FFF0F0' }}>
          <div style={{ fontSize: '14px', color: '#C94A4A', marginBottom: '5px' }}>Critical Low Stock Alert</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#A62B2B' }}>{lowStockItems} SKUs</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#A06A42' }}>📋 Complete Inventory Audit</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #F5ECE5', color: '#8A766A', fontSize: '14px' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Item Name</th>
              <th style={{ padding: '10px' }}>Category</th>
              <th style={{ padding: '10px' }}>Unit Price</th>
              <th style={{ padding: '10px' }}>Stock Remainder</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #FDF8F5', fontSize: '14px' }}>
                <td style={{ padding: '12px 10px' }}>#{p.id}</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{p.name}</td>
                <td style={{ padding: '12px 10px' }}>{p.category}</td>
                <td style={{ padding: '12px 10px' }}>₱{parseFloat(p.price || 0).toLocaleString()}</td>
                <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{p.stock}</td>
                <td style={{ padding: '12px 10px' }}>
                  {p.stock === 0 ? (
                    <span style={{ backgroundColor: '#FFF0F0', color: 'red', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Empty</span>
                  ) : p.stock <= 5 ? (
                    <span style={{ backgroundColor: '#FFF9E6', color: '#B37D00', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Low Stock</span>
                  ) : (
                    <span style={{ backgroundColor: '#EAF9F6', color: '#2A7B6B', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Healthy</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}