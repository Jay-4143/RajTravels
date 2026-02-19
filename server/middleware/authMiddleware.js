/**
 * JWT Authentication Middleware
 * Protects routes requiring user authentication
 */

const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../utils/tokenBlacklist');

/**
 * Verify JWT and attach user to request
 */
const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header (Bearer token)
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized - No token' });
    }

    // Check if token is blacklisted (logout)
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ success: false, message: 'Token has been invalidated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role || 'user' };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * Optional auth - attaches user if token present, doesn't fail if absent
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token && !isTokenBlacklisted(token)) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role || 'user' };
    }
  } catch (err) {
    // Ignore token errors for optional auth
  }
  next();
};

module.exports = { protect, optionalAuth };
