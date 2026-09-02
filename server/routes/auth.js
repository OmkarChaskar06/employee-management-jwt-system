const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbAsync } = require('../db/database');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_employee_management_2026_x987';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Helper function for email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ==========================================
// 1. USER REGISTRATION: POST /api/auth/register
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;

    // Form Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Full Name is required.'
      });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Please provide a valid email address.'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists (Email uniqueness check)
    const existingUser = await dbAsync.get('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Conflict Error: An account with this email address already exists.'
      });
    }

    // Secure Password Hashing with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userDept = department ? department.trim() : 'Engineering';
    const userRole = role ? role.trim() : 'Employee';

    // Save user to SQLite Database
    const result = await dbAsync.run(
      'INSERT INTO users (name, email, password, department, role) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanEmail, passwordHash, userDept, userRole]
    );

    // Generate JWT Token for immediate auto-login after register
    const payload = {
      id: result.id,
      name: cleanName,
      email: cleanEmail,
      role: userRole
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: result.id,
        name: cleanName,
        email: cleanEmail,
        role: userRole,
        department: userDept,
        created_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Server error during registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating user account.'
    });
  }
});

// ==========================================
// 2. USER LOGIN: POST /api/auth/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Email and Password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch user from DB
    const user = await dbAsync.get('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: Incorrect email address or password.'
      });
    }

    // Verify Password Hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: Incorrect email address or password.'
      });
    }

    // Create JWT Token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        bio: user.bio,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('❌ Server error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login attempt.'
    });
  }
});

// ==========================================
// 3. GET LOGGED-IN USER PROFILE: GET /api/auth/me (Protected Route)
// ==========================================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch details for the logged-in user ONLY (Preventing unauthorized access to other user data)
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

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('❌ Error fetching authenticated user details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile information.'
    });
  }
});

module.exports = router;
