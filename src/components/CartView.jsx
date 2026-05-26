import React from 'react';

export default function CartView({ cart, updateQuantity, removeFromCart, subtotal, finalTotal, handleCheckout }) {
  return (
    <div style={{ display: 'flex', gap: '30px' }}>
      <div style={{ flex: 2 }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Your Shopping Bag</h1>
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
            <p>Your shopping cart is empty!</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #F0E1D7' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#634832' }}>₱{parseFloat((item.price || 0) * item.quantity).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '5px 10px' }}>-</button>
                <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '5px 10px' }}>+</button>
                <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #F0E1D7', height: 'fit-content' }}>
        <h3>Order Summary</h3>
        <p style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span> <span>₱{subtotal.toLocaleString()}</span></p>
        <h2 style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #EED9CC', paddingTop: '15px' }}><span>Total:</span> <span>₱{finalTotal.toLocaleString()}</span></h2>
        <button onClick={handleCheckout} disabled={cart.length === 0} style={{ width: '100%', backgroundColor: '#634832', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>
          Go to Checkout
        </button>
      </div>
    </div>
  );
}