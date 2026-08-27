import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, AlertTriangle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  // const [payment, setPayment]= useState([])

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/my-orders');
      console.log(res.data.orders);
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await api.patch(`/orders/${orderId}/cancel`);
      if (res.data.success) {
        setActionMessage("Order cancelled successfully");
        fetchOrders();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to cancel order");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-amber" style={{ gap: '0.3rem' }}><Clock size={13} /> Pending</span>;
      case 'confirmed':
        return <span className="badge badge-cyan" style={{ gap: '0.3rem' }}><CheckCircle2 size={13} /> Confirmed</span>;
      case 'shipped':
        return <span className="badge badge-cyan" style={{ gap: '0.3rem' }}><Truck size={13} /> Shipped</span>;
      case 'delivered':
        return <span className="badge badge-emerald" style={{ gap: '0.3rem' }}><CheckCircle2 size={13} /> Delivered</span>;
      case 'cancelled':
        return <span className="badge badge-rose" style={{ gap: '0.3rem' }}><XCircle size={13} /> Cancelled</span>;
      default:
        return <span className="badge badge-amber">{status}</span>;
    }
  };

  

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>My Order <span className="gradient-text">History</span></h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Track your recent purchases, view delivery status, or manage order cancellations.
      </p>

      {actionMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--accent-emerald)',
          padding: '0.85rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {actionMessage}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '1.5rem' }}>
              
              {/* Order Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem',
                marginBottom: '1.2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    ORDER ID: {order._id}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total: </span>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div>{getStatusBadge(order.status)}</div>
                  <div className={`badge ${order.paymentStatus === 'paid' ? 'badge-emerald':'badge-amber'}`}
                  style={{gap:'0.5rem'}}><chechCircle2 size={13}/>{order.paymentStatus?.toUpperCase()}</div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.2rem' }}>
                {order.items.map((item, index) => {
                  const product = item.productId;
                  const img = product?.productImage?.Image_url || product?.productImage?.url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
                  
                  return (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <img src={img} alt="Product" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                          {product ? product.productName : 'Product (Deleted)'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Footer Actions */}
              {order.status === 'pending' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <button onClick={() => handleCancelOrder(order._id)} className="btn btn-danger btn-sm">
                    Cancel Order
                  </button>
                </div>
              )}

            </div>
          ))}
          
        </div>
      )}

    </div>
  );
};
