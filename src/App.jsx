import React, { useState, useEffect } from 'react';
import './styles/store.css';

// Import Modular Components Archetypes
import Sidebar from './components/Sidebar';
import CatalogView from './components/CatalogView';
import CartView from './components/CartView';
import SalesView from './components/SalesView';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('dashboard'); 
  const [role, setRole] = useState('customer'); 

  const fetchProducts = () => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error loading products:", err);
        setProducts([]);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [view]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= (product.stock || 0)) return prevCart;
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const targetProduct = products.find(p => p.id === id);
        const newQty = item.quantity + amount;
        if (newQty <= 0) return null; 
        if (targetProduct && newQty > (targetProduct.stock || 0)) return item; 
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const handleRestock = async (productId, currentStock) => {
    const additionalStock = prompt("Enter amount of new stock to add:", "10");
    if (!additionalStock || isNaN(additionalStock)) return;
    
    const newStockCount = parseInt(currentStock) + parseInt(additionalStock);
    try {
      const response = await fetch(`http://localhost:8000/products/${productId}/restock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStockCount })
      });
      if (response.ok) {
        alert("✨ Inventory Updated Successfully!");
        fetchProducts(); 
      }
    } catch (err) {
      alert("Error reaching server to restock.");
    }
  };

  // Calculations Infrastructure
  const subtotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const discount = subtotal > 5000 ? subtotal * 0.10 : 0; 
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const finalTotal = subtotal - discount + deliveryFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      for (const item of cart) {
        await fetch('http://localhost:8000/buy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: item.id, quantity: item.quantity })
        });
      }
      alert("✨ Transaction Confirmed! Order processed inside PostgreSQL database successfully.");
      setCart([]);
      setView('dashboard');
    } catch (err) {
      alert("Checkout failed.");
    }
  };

  const validProducts = Array.isArray(products) ? products : [];
  const categories = [...new Set(validProducts.map(p => p.category || 'General'))];
  const totalStockInStore = validProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalUniqueItems = validProducts.length;
  const lowStockItems = validProducts.filter(p => (p.stock || 0) <= 5).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Sidebar 
        role={role} setRole={setRole} 
        view={view} setView={setView} 
        cartCount={cartCount} 
      />

      <main className="main-workspace">
        {view === 'dashboard' && (
          <CatalogView 
            role={role} products={validProducts} 
            categories={categories} addToCart={addToCart} 
            handleRestock={handleRestock} 
          />
        )}

        {view === 'cart' && role === 'customer' && (
          <CartView 
            cart={cart} updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} subtotal={subtotal} 
            finalTotal={finalTotal} handleCheckout={handleCheckout} 
          />
        )}

        {view === 'sales' && role === 'manager' && (
          <SalesView 
            products={validProducts} totalUniqueItems={totalUniqueItems} 
            totalStockInStore={totalStockInStore} lowStockItems={lowStockItems} 
          />
        )}
      </main>
    </div>
  );
}