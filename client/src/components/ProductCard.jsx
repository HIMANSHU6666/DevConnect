import React from 'react';
import { ShoppingCart, Tag, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { user, openAuth } = useAuth();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      openAuth('login');
      return;
    }
    const res = await addToCart(product._id, 1);
    if (!res.success) {
      alert(res.message);
    }
  };

  const discount = product.productDisscount || product.productDiscount || 0;
  const originalPrice = product.productPrice;
  const finalPrice = discount > 0 ? (originalPrice * (1 - discount / 100)).toFixed(2) : originalPrice.toFixed(2);
  const imageUrl = product.productImage?.Image_url || product.productImage?.url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      className="glass-card" 
      onClick={() => onViewDetails(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%'
      }}
    >
      {/* Image & Badge Overlay */}
      <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden', background: '#121824' }}>
        <img 
          src={imageUrl} 
          alt={product.productName}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />

        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
          <span className="badge badge-cyan">{product.productCategory}</span>
          {discount > 0 && (
            <span className="badge badge-rose">-{discount}% OFF</span>
          )}
        </div>

        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          {product.productStock > 0 ? (
            <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} /> {product.productStock} In Stock
            </span>
          ) : (
            <span className="badge badge-rose" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <AlertCircle size={12} /> Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem', fontFamily: 'monospace' }}>
            CODE: {product.productCode}
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {product.productName}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.productDescription}
          </p>
        </div>

        {/* Price & Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              ${finalPrice}
            </div>
            {discount > 0 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                ${originalPrice.toFixed(2)}
              </div>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={product.productStock < 1}
            className="btn btn-primary btn-sm"
          >
            <ShoppingCart size={15} /> Add
          </button>
        </div>

      </div>
    </div>
  );
};
