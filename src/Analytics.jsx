import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics({ data }) {
  console.log("Analytics component received this data:", data); // Add this!
  
  if (!data) return <div>Data is missing!</div>;
  // Update the references inside the function
  const chartData = [
    { name: 'Revenue', value: data.totalRevenue },
    { name: 'Orders', value: data.activeOrders },
  ];
  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #e0e0e0' }}>
      <h3>Sales Intelligence Overview</h3>
      
      {/* 2. Chart Section - Use chartData here! */}
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

      {/* 3. Summary Text - Use data here! */}
      <div style={{ marginTop: '20px', padding: '20px', background: '#fff0f0', borderRadius: '10px' }}>
        <p style={{ fontSize: '1.2rem' }}>
          <strong>Total Revenue:</strong> ₱{Number(data.totalRevenue).toLocaleString()}
        </p>
        <p style={{ fontSize: '1.2rem' }}>
          <strong>Total Completed Orders:</strong> {data.activeOrders}
        </p>
      </div>
    </div>
  );
}