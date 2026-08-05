import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Marketplace } from './pages/Marketplace';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <AuthModal />
            <footer style={{
              borderTop: '1px solid var(--border-color)',
              padding: '1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginTop: '3rem',
              background: 'rgba(10, 13, 20, 0.8)'
            }}>
              DevConnect &copy; {new Date().getFullYear()} — Premium Developer Community & E-Commerce Platform
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
