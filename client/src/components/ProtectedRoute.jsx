import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Login } from './Login';

export const ProtectedRoute = ({ children, onSwitchToRegister }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="main-content">
        <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Verifying session security...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onSwitchToRegister={onSwitchToRegister} />;
  }

  return children;
};
