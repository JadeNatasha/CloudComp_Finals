// InventoryManagement.jsx
export default function InventoryManagement({ inventory }) {
  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={headerRowStyle}>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Stock Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} style={rowStyle}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.stock}</td>
              <td>
                <span style={statusBadge(item.stock)}>{item.stock > 5 ? 'In Stock' : 'Low Stock'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Minimalist Styles
const containerStyle = { background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left' };
const headerRowStyle = { borderBottom: '2px solid #f4f4f4', color: '#888' };
const rowStyle = { borderBottom: '1px solid #f9f9f9' };
const statusBadge = (stock) => ({
  padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
  background: stock > 5 ? '#e6f4ea' : '#fff0f0', color: stock > 5 ? '#1e7e34' : '#d93025'
});