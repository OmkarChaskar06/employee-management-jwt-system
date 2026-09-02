import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <ShieldCheck size={20} />
        </div>
        <span>EmployeePortal</span>
      </div>

      {isAuthenticated && user && (
        <div className="navbar-user">
          <div className="user-badge">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span>{user.name}</span>
          </div>

          <button onClick={logout} className="btn-logout" title="Sign out of system">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};
