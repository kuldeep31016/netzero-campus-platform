const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateUser, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/register', validateUser, handleValidationErrors, authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, validateUser, handleValidationErrors, authController.updateProfile);
router.delete('/account', authenticateToken, authController.deleteAccount);

// Admin routes
router.get('/users', authenticateToken, authorizeRoles('admin'), authController.getAllUsers);
router.get('/users/:id', authenticateToken, authorizeRoles('admin'), authController.getUserById);
router.put('/users/:id', authenticateToken, authorizeRoles('admin'), validateUser, handleValidationErrors, authController.updateUser);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), authController.deleteUser);
router.put('/users/:id/role', authenticateToken, authorizeRoles('admin'), authController.updateUserRole);

// User statistics
router.get('/stats', authenticateToken, authController.getUserStats);
router.get('/leaderboard', authenticateToken, authController.getLeaderboard);

module.exports = router;