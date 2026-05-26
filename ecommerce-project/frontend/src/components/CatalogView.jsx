import React from 'react';

export default function CatalogView({ role, products, categories, addToCart, handleRestock }) {
  return (
    <div>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        {role === 'manager' ? '🛠️ Live Inventory Manager Control' : '🛍️ Product Showcase Matrix'}
      </h1>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#8A766A' }}>
          ⚠️ Your database is empty or the backend server is offline. Add item rows to your tables!
        </div>
      ) : (
        categories.map(cat => (
          <div key={cat} className="category-container">
            <h3 className="category-title">{cat}</h3>
            <div className="grid-display">
              {products.filter(p => (p.category || 'General') === cat).map(product => (
                <div key={product.id} className="product-card">
                  <div className="image-frame">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150?text=' + encodeURIComponent(product.name || 'Item');
                      }}
                    />
                  </div>
                  <h4 style={{ margin: '5px 0', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#8A766A' }}>
                    ₱{parseFloat(product.price || 0).toLocaleString()} | 
                    <strong style={{ color: (product.stock || 0) === 0 ? 'red' : '#4A3B32' }}> Stock: {product.stock || 0}</strong>
                  </p>

                  {role === 'customer' ? (
                    <button 
                      onClick={() => addToCart(product)}
                      disabled={(product.stock || 0) <= 0}
                      className="btn-action"
                      style={{ backgroundColor: '#DDA15E', color: 'white' }}
                    >
                      {(product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRestock(product.id, product.stock || 0)}
                      className="btn-action"
                      style={{ backgroundColor: '#634832', color: 'white' }}
                    >
                      ➕ Add Stock (DB)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}