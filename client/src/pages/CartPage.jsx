import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Payment from '../components/Payment.jsx'

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const { user, openAuth } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [error, setError] = useState('');
  const [orderId,setOrderId]=useState(null);
  
  if (!user) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShoppingBag size={48} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Your Cart is Waiting</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.8rem' }}>
            Please log in or create an account to view and manage your cart items.
          </p>
          <button onClick={() => openAuth('login')} className="btn btn-primary">
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  const items = cart.items || [];
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const product = item.productId;
      if (!product) return sum;
      const discount = product.productDisscount || product.productDiscount || 0;
      const price = discount > 0 ? product.productPrice * (1 - discount / 100) : product.productPrice;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    setError('');
    try {
      const res = await api.post('/orders/create');
      if (res.data.success) {
        // setCheckoutMessage('Order placed successfully! Redirecting to orders...');
        // fetchCart();
        // setTimeout(() => {
          // navigate('/orders');
        // }, 2000);
        const orderId = res.data.order._id;
        console.log("created order id",orderId);
        setOrderId(orderId);

        const paymentRes = await api.post('/payment/create-payment',{
          orderId
        });
        console.log("payment Response",paymentRes.data);
        

      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Shopping <span className="gradient-text">Cart</span></h1>

      {checkoutMessage && (
        <div className="glass-panel" style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--accent-emerald)',
          padding: '1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={24} /> {checkoutMessage}
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Explore our marketplace to find incredible developer tools & gear!</p>
          <Link to="/" className="btn btn-primary">
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
          
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              const discount = product.productDisscount || product.productDiscount || 0;
              const unitPrice = discount > 0 ? product.productPrice * (1 - discount / 100) : product.productPrice;
              const itemTotal = unitPrice * item.quantity;
              const img = product.productImage?.Image_url || product.productImage?.url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';

              return (
                <div key={product._id} className="glass-panel" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  padding: '1.2rem'
                }}>
                  <img 
                    src={img} 
                    alt={product.productName} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.2rem' }}>
                      {product.productCategory}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{product.productName}</h3>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      ${unitPrice.toFixed(2)} each
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
                    <button 
                      onClick={() => updateQuantity(product._id, 'decrease')} 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: '700', padding: '0 0.4rem', fontSize: '0.95rem' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(product._id, 'increase')} 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '0.2rem 0.5rem' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '90px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                      ${itemTotal.toFixed(2)}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(product._id)} 
                    className="btn btn-danger btn-sm"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal ({items.length} items):</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Shipping & Taxes:</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: '600' }}>FREE</span>
            </div>

            <div style={{
              display: 'flex',
              justify: 'space-between',
              margin: '1.2rem 0',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '1.3rem',
              fontWeight: '800'
            }}>
              <span>Total:</span>
              <span className="gradient-text">${calculateTotal().toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={checkingOut} 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            >
              {checkingOut ? 'Processing Order...' : 'Proceed to Checkout'} <ArrowRight size={18} />
            </button>
            {orderId && <Payment orderId={orderId} />}
          </div>

        </div>
      )}

    </div>
  );
};
