import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, X, ShoppingCart, User, CheckCircle } from 'lucide-react';
import api from '../api';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ["All", "Software", "Hardware", "DevTools", "Courses", "Accessories"];

export const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useCart();
  const { user, openAuth } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const handleAddToCartDetail = async () => {
    if (!user) {
      openAuth('login');
      return;
    }
    if (selectedProduct) {
      const res = await addToCart(selectedProduct._id, 1);
      if (!res.success) alert(res.message);
      else setSelectedProduct(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.25)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          <Sparkles size={16} /> Developer Marketplace & Ecosystem
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '1rem' }}>
          Discover & Trade Tools Built for <span className="gradient-text">Developers</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Explore curated dev tools, hardware modules, software templates, and community gear verified by top engineers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search products by name, code, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.8rem', width: '100%' }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.4rem' }}>
              <Filter size={15} /> Categories:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`btn ${category === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }} className="gradient-text">Loading Marketplace Products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Try adjusting your search criteria or category filter.</p>
          <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.8rem'
        }}>
          {products.map(product => (
            <ProductCard key={product._id} product={product} onViewDetails={setSelectedProduct} />
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }} className="animate-fade-in">
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '650px',
            padding: '2rem',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <img 
                src={selectedProduct.productImage?.Image_url || selectedProduct.productImage?.url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'}
                alt={selectedProduct.productName}
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
              />

              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span className="badge badge-cyan">{selectedProduct.productCategory}</span>
                  <span className="badge badge-emerald">Code: {selectedProduct.productCode}</span>
                </div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>{selectedProduct.productName}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {selectedProduct.productDescription}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Price:</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                      ${selectedProduct.productPrice}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock Status:</span>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: selectedProduct.productStock > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {selectedProduct.productStock > 0 ? `${selectedProduct.productStock} available` : 'Out of stock'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleAddToCartDetail}
                    disabled={selectedProduct.productStock < 1}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.85rem' }}
                  >
                    <ShoppingCart size={18} /> Add to Shopping Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
