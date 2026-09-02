const express = require('express');
const router = express.Router();
const { dbAsync } = require('../db/database');
const { verifyToken } = require('../middleware/auth');

// ==========================================
// GET USER DASHBOARD STATS: GET /api/user/dashboard
// ==========================================
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve logged-in user profile
    const user = await dbAsync.get(
      'SELECT id, name, email, role, department, bio, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    // Retrieve total system user count for stats card
    const totalUsersRow = await dbAsync.get('SELECT COUNT(*) as count FROM users');

    // Create personalized user activity & metrics
    const stats = {
      totalEmployees: totalUsersRow ? totalUsersRow.count : 1,
      userDepartment: user.department || 'Engineering',
      userRole: user.role || 'Employee',
      sessionStatus: 'Active & Verified',
      tokenSecurity: 'JWT 256-bit Signature',
      recentActivities: [
        { id: 1, action: 'Successfully authenticated via JWT', time: 'Just now', type: 'security' },
        { id: 2, action: 'Loaded personalized dashboard view', time: '1 min ago', type: 'system' },
        { id: 3, action: 'Account created & verified', time: new Date(user.created_at).toLocaleDateString(), type: 'account' }
      ]
    };

    return res.status(200).json({
      success: true,
      user,
      stats
    });
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics.'
    });
  }
});

module.exports = router;
