// src/Analytics.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics({ data }) {
  
  // This function handles the manual trigger
  const handleManualSync = () => {
    fetch('http://localhost:8000/api/trigger-etl', { method: 'POST' })
      .then(response => response.json())
      .then(result => {
        alert("Sync complete! The page will refresh now.");
        window.location.reload(); // Refresh the page to show new data
      })
      .catch(error => console.error("Error triggering ETL:", error));
  };

  const chartData = [
    { name: 'Revenue', value: data.totalRevenue },
    { name: 'Orders', value: data.activeOrders },
  ];

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Sales Intelligence Overview</h3>
        {/* The Sync Button */}
        <button 
          onClick={handleManualSync}
          style={{ padding: '10px 20px', background: '#f3c1c1', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Manual Sync
        </button>
      </div>
      
      <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f3c1c1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#fff0f0', borderRadius: '10px' }}>
        <p style={{ fontSize: '1.2rem' }}><strong>Total Revenue:</strong> ₱{Number(data.totalRevenue).toLocaleString()}</p>
        <p style={{ fontSize: '1.2rem' }}><strong>Total Completed Orders:</strong> {data.activeOrders}</p>
      </div>
    </div>
  );
}