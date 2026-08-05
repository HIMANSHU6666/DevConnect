import React, { useState } from 'react';
import { X, Lock, Mail, User, Tag, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (authMode === 'login') {
        const res = await login({
          email: formData.email,
          username: formData.email, // backend handles email || username
          password: formData.password
        });
      } else {
        await register(formData);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }} className="animate-fade-in">
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Close button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
            {authMode === 'login' ? 'Welcome Back' : 'Join DevConnect'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {authMode === 'login' ? 'Sign in to access your developer marketplace' : 'Create an account to buy or sell developer gear & tools'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="John Doe" 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="johndoe" 
                  className="form-input" 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">{authMode === 'login' ? 'Email or Username' : 'Email Address'}</label>
            <input 
              type="text" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="user@example.com" 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="••••••••" 
              className="form-input" 
            />
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label className="form-label">Account Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'buyer' })}
                  className={`btn ${formData.role === 'buyer' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                >
                  Buyer 🛒
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'seller' })}
                  className={`btn ${formData.role === 'seller' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                >
                  Seller 💼
                </button>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            {submitting ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {authMode === 'login' ? (
            <span>Don't have an account? <button type="button" onClick={() => { setAuthMode('register'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '600', cursor: 'pointer' }}>Register</button></span>
          ) : (
            <span>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '600', cursor: 'pointer' }}>Sign In</button></span>
          )}
        </div>
      </div>
    </div>
  );
};
