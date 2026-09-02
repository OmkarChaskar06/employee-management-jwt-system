import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, Mail, Shield, Award, Calendar, CheckCircle2, 
  Activity, Users, Lock, RefreshCw, Layers
} from 'lucide-react';

export const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch protected dashboard statistics for the authenticated user
  const fetchDashboardData = async () => {
    try {
      setLoadingStats(true);
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load user-specific dashboard data:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const stats = dashboardData?.stats;

  return (
    <div className="dashboard-container animate-fade-in">
      {/* Personalized Welcome Banner */}
      <section className="welcome-hero">
        <div>
          <div className="hero-badge">
            <Shield size={14} />
            <span>Authenticated Session Active</span>
          </div>
          <h1 className="welcome-title">
            Welcome, <span>{user?.name || 'Employee'}</span>
          </h1>
          <p className="welcome-subtitle">
            You are securely logged into your personal employee portal. Access your verified records, departmental metrics, and account security options below.
          </p>
        </div>

        <button 
          onClick={fetchDashboardData} 
          className="user-badge" 
          style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.06)' }}
          title="Refresh dashboard stats"
        >
          <RefreshCw size={14} className={loadingStats ? 'spinner' : ''} />
          <span>Refresh Data</span>
        </button>
      </section>

      {/* Summary Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-num">{stats?.totalEmployees || 1}</div>
            <div className="stat-desc">Total Active Employees</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#67e8f9' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-num">{user?.department || 'Engineering'}</div>
            <div className="stat-desc">Assigned Department</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
            <Lock size={22} />
          </div>
          <div>
            <div className="stat-num">Verified</div>
            <div className="stat-desc">256-Bit JWT Encryption</div>
          </div>
        </div>
      </div>

      {/* Detailed Dashboard Grid */}
      <div className="dashboard-grid">
        {/* User Profile Card */}
        <div className="dashboard-card">
          <h2 className="card-title">
            <User size={20} color="var(--accent-secondary)" />
            <span>Employee Profile</span>
          </h2>

          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user?.name}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value" style={{ fontFamily: 'var(--font-mono)' }}>{user?.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">System User ID</span>
              <span className="info-value" style={{ fontFamily: 'var(--font-mono)' }}>#USR-00{user?.id}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Access Level / Role</span>
              <span className="role-tag">{user?.role || 'Employee'}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{user?.department || 'Engineering'}</span>
            </div>

            {user?.created_at && (
              <div className="info-item">
                <span className="info-label">Account Created</span>
                <span className="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security & Activity Overview */}
        <div className="dashboard-card">
          <h2 className="card-title">
            <Activity size={20} color="var(--accent-primary)" />
            <span>Session Audit & Activity Log</span>
          </h2>

          <div className="activity-list">
            {stats?.recentActivities ? (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-text">{act.action}</div>
                  <div className="activity-time">{act.time}</div>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <div className="activity-dot" />
                <div className="activity-text">Authenticated via JWT Token successfully</div>
                <div className="activity-time">Just now</div>
              </div>
            )}
          </div>

          <div className="security-banner">
            <CheckCircle2 size={24} style={{ shrink: 0 }} />
            <div>
              <strong>Protected Route Authorization Verified</strong>
              <p style={{ margin: 0, opacity: 0.85 }}>
                Your session is secured using JSON Web Tokens (JWT) stored in isolated state. Other users cannot access your profile data or personal credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
