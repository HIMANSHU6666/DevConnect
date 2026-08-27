import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, Edit, Trash2, ShieldAlert, Clock, X } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'add', 'seller-orders'
  const [myProducts, setMyProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Track if we are editing an existing product
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const initialFormState = {
    productName: '',
    productCode: '',
    productPrice: '',
    productImage: '',
    productDescription: '',
    productDiscount: '0',
    productCategory: 'Software',
    productStock: '10'
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products/My-Products'),
        api.get('/orders/seller-orders')
      ]);

      if (prodRes.data.success) {
        setMyProducts(prodRes.data.products);
      }
      if (orderRes.data.success) {
        setSellerOrders(orderRes.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'seller') {
      fetchSellerData();
    }
  }, [user]);

  if (!user || user.role !== 'seller') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '540px', margin: '0 auto', padding: '3rem 2rem' }}>
          <ShieldAlert size={48} color="var(--accent-rose)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Seller Hub Access Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.8rem' }}>
            Your account is currently set to <strong>Buyer</strong>. To list products, manage inventory, and fulfill developer orders, please switch your role to Seller in your profile.
          </p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pre-fill form for editing
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setFormData({
      productName: product.productName || '',
      productCode: product.productCode || '',
      productPrice: product.productPrice || '',
      productImage: product.productImage?.Image_url || product.productImage?.url || product.productImageUrl || '',
      productDescription: product.productDescription || '',
      productDiscount: product.productDiscount || '0',
      productCategory: product.productCategory || 'Software',
      productStock: product.productStock || '10'
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form and cancel edit
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingProductId(null);
  };

  // Add OR Update Handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {
        ...formData,
        productPrice: Number(formData.productPrice),
        productStock: Number(formData.productStock),
        productDiscount: Number(formData.productDiscount),
        productImageUrl: formData.productImage
      };

      let res;
      if (editingProductId) {
        // Update existing product
        res = await api.put(`/products/${editingProductId}`, payload);
      } else {
        // Create new product
        res = await api.post('/products', payload);
      }

      if (res.data.success) {
        setMessage(editingProductId ? 'Product updated successfully!' : 'Product listed successfully!');
        resetForm();
        fetchSellerData();
        setActiveTab('products');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        setMessage('Product deleted successfully');
        fetchSellerData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setMessage(`Order status updated to '${newStatus}'`);
        fetchSellerData();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Seller <span className="gradient-text">Hub</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your product listings and developer order fulfillments.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => { setActiveTab('products'); resetForm(); }} 
            className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Package size={16} /> My Listings ({myProducts.length})
          </button>

          <button 
            onClick={() => { resetForm(); setActiveTab('add'); }} 
            className={`btn ${activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <PlusCircle size={16} /> {editingProductId ? 'Edit Product' : 'Add Product'}
          </button>

          <button 
            onClick={() => { setActiveTab('seller-orders'); resetForm(); }} 
            className={`btn ${activeTab === 'seller-orders' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Clock size={16} /> Seller Orders ({sellerOrders.length})
          </button>
        </div>
      </div>

      {message && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--accent-emerald)',
          padding: '0.85rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          padding: '0.85rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* Tab 1: My Listings */}
      {activeTab === 'products' && (
        loading ? (
          <div>Loading seller products...</div>
        ) : myProducts.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Products Listed</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Click "Add Product" to list your first item on DevConnect!</p>
            <button onClick={() => { resetForm(); setActiveTab('add'); }} className="btn btn-primary">
              <PlusCircle size={16} /> Add Product
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {myProducts.map(p => (
              <div key={p._id} className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img 
                    src={p.productImage?.Image_url || p.productImage?.url || p.productImageUrl} 
                    alt={p.productName} 
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.8rem' }} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-cyan">{p.productCategory}</span>
                    <span className="badge badge-emerald">{p.productStock} in stock</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{p.productName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '0.6rem' }}>CODE: {p.productCode}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)', marginTop: '0.8rem', gap: '0.5rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                    ${p.productPrice}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditClick(p)} className="btn btn-secondary btn-sm" title="Edit Product">
                      <Edit size={15} /> Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(p._id)} className="btn btn-danger btn-sm" title="Delete Product">
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Tab 2: Add / Edit Product Form */}
      {activeTab === 'add' && (
        <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem' }}>
              {editingProductId ? 'Edit Product Details' : 'Create New Product Listing'}
            </h2>
            {editingProductId && (
              <button 
                type="button" 
                onClick={() => { resetForm(); setActiveTab('products'); }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} required placeholder="e.g. React UI Kit Pro" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Product Code (Unique) {editingProductId ? '(Locked)' : '*'}
                </label>
                <input 
                  type="text" 
                  name="productCode" 
                  value={formData.productCode} 
                  onChange={handleInputChange} 
                  required 
                  disabled={Boolean(editingProductId)} // Edit ke time change nahi hoga
                  placeholder="e.g. UIKIT-101" 
                  className="form-input" 
                  style={editingProductId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Price ($) *</label>
                <input type="number" step="0.01" name="productPrice" value={formData.productPrice} onChange={handleInputChange} required placeholder="49.99" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" name="productStock" value={formData.productStock} onChange={handleInputChange} required placeholder="25" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Discount (%)</label>
                <input type="number" name="productDiscount" value={formData.productDiscount} onChange={handleInputChange} placeholder="0" className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="productCategory" value={formData.productCategory} onChange={handleInputChange} className="form-select">
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="DevTools">DevTools</option>
                  <option value="Courses">Courses</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input type="url" name="productImage" value={formData.productImage} onChange={handleInputChange} required placeholder="https://images.unsplash.com/..." className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="productDescription" value={formData.productDescription} onChange={handleInputChange} required rows="4" placeholder="Detailed product specifications and features..." className="form-textarea" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}>
              {editingProductId ? 'Update Product Listing' : 'Publish Product Listing'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Seller Orders */}
      {activeTab === 'seller-orders' && (
        sellerOrders.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Clock size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Orders Received Yet</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Orders containing your products will appear here for fulfillment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {sellerOrders.map(order => (
              <div key={order._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER: {order._id}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Buyer: {order.userId?.name || 'Unknown'} ({order.userId?.email})</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>Total: ${order.totalAmount}</span>
                    <span className="badge badge-amber">{order.status}</span>
                  </div>
                </div>

                {/* Change Status Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Update Status:</span>
                  {["confirmed", "shipped", "delivered", "cancelled"].map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateOrderStatus(order._id, st)}
                      disabled={order.status === st}
                      className={`btn ${order.status === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};