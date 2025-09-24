const admin = require('../config/firebase');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Access token is required'
      });
    }

    // Verify Firebase token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }

    // Get or create user in database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Unknown User',
        role: decodedToken.role || 'student',
        department: decodedToken.department || 'General'
      });
      await user.save();
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Attach user info to request
    req.user = {
      id: user._id,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      displayName: user.displayName,
      role: user.role,
      department: user.department,
      customClaims: decodedToken
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Define role permissions
    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_challenges', 'view_all_data'],
      faculty: ['read', 'write', 'manage_department_data', 'create_challenges'],
      student: ['read', 'write_own', 'participate_challenges']
    };

    const userPermissions = permissions[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

const checkResourceOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          status: 'error',
          message: 'Resource not found'
        });
      }

      // Admin can access all resources
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check if user owns the resource or is in the same department
      const hasAccess = 
        resource.reportedBy?.toString() === req.user.id ||
        resource.user?.toString() === req.user.id ||
        (resource.department && resource.department === req.user.department);

      if (!hasAccess) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied to this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error checking resource access'
      });
    }
  };
};

// Optional authentication for public endpoints
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (user) {
        req.user = {
          id: user._id,
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          displayName: user.displayName,
          role: user.role,
          department: user.department
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  checkPermission,
  checkResourceOwnership,
  optionalAuth
};