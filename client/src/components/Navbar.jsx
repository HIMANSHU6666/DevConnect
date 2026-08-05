import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User as UserIcon, LogOut, Code, Package, PlusCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout, openAuth } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)'
          }}>
            <Code size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: '800' }} className="gradient-text">
            DevConnect
          </span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
          <Link to="/" style={{
            color: isActive('/') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            fontWeight: isActive('/') ? '600' : '500',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
          }}>
            Marketplace
          </Link>

          {user && (
            <Link to="/orders" style={{
              color: isActive('/orders') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: isActive('/orders') ? '600' : '500',
              textDecoration: 'none',
              fontSize: '0.95rem',
              transition: 'color 0.2s'
            }}>
              My Orders
            </Link>
          )}

          {user && user.role === 'seller' && (
            <Link to="/seller" style={{
              color: isActive('/seller') ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: isActive('/seller') ? '600' : '500',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}>
              <Package size={16} />
              Seller Hub
            </Link>
          )}
        </nav>

        {/* Action Buttons & Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          
          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', color: 'var(--text-main)', textDecoration: 'none', padding: '0.4rem' }}>
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: '700',
                borderRadius: '999px',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255, 0, 127, 0.4)'
              }}>
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User Auth Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="btn btn-secondary"
                style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.9rem', gap: '0.5rem' }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user.username}</span>
                <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{user.role}</span>
              </button>

              {dropdownOpen && (
                <div className="glass-panel animate-fade-in" style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '200px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="btn btn-secondary" style={{ justifyContent: 'flex-start', border: 'none' }}>
                    <UserIcon size={16} /> Profile
                  </Link>
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="btn btn-danger" style={{ justifyContent: 'flex-start' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button onClick={() => openAuth('login')} className="btn btn-secondary">
                Login
              </button>
              <button onClick={() => openAuth('register')} className="btn btn-primary">
                Register
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
};
