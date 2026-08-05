import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    role: 'buyer'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        role: user.role || 'buyer'
      });
    }
  }, [user]);

  if (!user) {
    return <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Please sign in to view profile.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await api.patch('/users/updateprofile', formData);
      if (res.data.success) {
        setMessage('Profile updated successfully!');
        if (res.data.user) {
          setUser(res.data.user);
        }
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.")) return;
    try {
      const res = await api.delete('/users/DeleteAccount');
      if (res.data.success) {
        logout();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>User <span className="gradient-text">Profile</span></h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Manage your personal information, account role, and developer settings.
        </p>

        {message && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--accent-emerald)',
            padding: '0.85rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <CheckCircle2 size={18} /> {message}
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

        <div className="glass-panel" style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: '800',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(0, 242, 254, 0.4)'
            }}>
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>{user.name}</h2>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.3rem' }}>
                <span className="badge badge-cyan">@{user.username}</span>
                <span className="badge badge-amber" style={{ textTransform: 'uppercase' }}>Role: {user.role}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} required className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                  <option value="buyer">Buyer (Shop Developer Products)</option>
                  <option value="seller">Seller (Sell & Fulfill Products)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Developer Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell the developer community about your skills and projects..." className="form-textarea" />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}>
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ color: 'var(--accent-rose)', marginBottom: '0.2rem' }}>Danger Zone</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Permanently remove your account and data.</p>
            </div>
            <button onClick={handleDeleteAccount} className="btn btn-danger btn-sm">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
