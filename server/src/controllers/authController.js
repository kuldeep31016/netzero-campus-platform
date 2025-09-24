const User = require('../models/User');
const admin = require('../config/firebase');
const { asyncHandler, NotFoundError, ValidationError, AuthenticationError } = require('../middleware/errorHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { displayName, department, role = 'student' } = req.body;

  // Get Firebase UID from the authenticated token
  if (!req.user || !req.user.firebaseUid) {
    throw new AuthenticationError('Firebase authentication required');
  }

  const { firebaseUid, email } = req.user;

  // Check if user already exists
  const existingUser = await User.findOne({ firebaseUid });
  if (existingUser) {
    throw new ValidationError('User already registered');
  }

  // Create new user
  const user = new User({
    firebaseUid,
    email,
    displayName,
    department,
    role
  });

  await user.save();

  // Set custom claims in Firebase
  await admin.auth().setCustomUserClaims(firebaseUid, {
    role,
    department,
    userId: user._id.toString()
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        department: user.department,
        sustainabilityProfile: user.sustainabilityProfile
      }
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  // Firebase handles authentication, this endpoint just returns user data
  const { firebaseUid } = req.user;

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new NotFoundError('User not found. Please register first.');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        department: user.department,
        sustainabilityProfile: user.sustainabilityProfile,
        preferences: user.preferences,
        lastLogin: user.lastLogin
      }
    }
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  // This would typically handle token refresh logic
  // For Firebase, token refresh is handled client-side
  res.json({
    status: 'success',
    message: 'Token refresh handled by Firebase client SDK'
  });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-firebaseUid')
    .lean();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Calculate user rank
  const higherRankedUsers = await User.countDocuments({
    'sustainabilityProfile.totalPoints': { $gt: user.sustainabilityProfile.totalPoints }
  });
  
  user.rank = higherRankedUsers + 1;

  res.json({
    status: 'success',
    data: { user }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, department, preferences } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update allowed fields
  if (displayName) user.displayName = displayName;
  if (department) user.department = department;
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  // Update Firebase custom claims if department changed
  if (department) {
    await admin.auth().setCustomUserClaims(user.firebaseUid, {
      role: user.role,
      department: user.department,
      userId: user._id.toString()
    });
  }

  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        department: user.department,
        preferences: user.preferences
      }
    }
  });
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Soft delete - mark as inactive
  user.isActive = false;
  await user.save();

  // Also disable in Firebase
  await admin.auth().updateUser(user.firebaseUid, { disabled: true });

  res.json({
    status: 'success',
    message: 'Account deactivated successfully'
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    department,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    search
  } = req.query;

  // Build query
  const query = { isActive: true };
  
  if (role) query.role = role;
  if (department) query.department = department;
  if (search) {
    query.$or = [
      { displayName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const users = await User.find(query)
    .select('-firebaseUid')
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await User.countDocuments(query);

  res.json({
    status: 'success',
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        limit: parseInt(limit)
      }
    }
  });
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/auth/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-firebaseUid')
    .lean();

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json({
    status: 'success',
    data: { user }
  });
});

// @desc    Update user (Admin only)
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { displayName, department, role, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Update fields
  if (displayName !== undefined) user.displayName = displayName;
  if (department !== undefined) user.department = department;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  // Update Firebase custom claims
  await admin.auth().setCustomUserClaims(user.firebaseUid, {
    role: user.role,
    department: user.department,
    userId: user._id.toString()
  });

  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: { user }
  });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Soft delete
  user.isActive = false;
  await user.save();

  // Disable in Firebase
  await admin.auth().updateUser(user.firebaseUid, { disabled: true });

  res.json({
    status: 'success',
    message: 'User deleted successfully'
  });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['admin', 'faculty', 'student'].includes(role)) {
    throw new ValidationError('Invalid role');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  user.role = role;
  await user.save();

  // Update Firebase custom claims
  await admin.auth().setCustomUserClaims(user.firebaseUid, {
    role: user.role,
    department: user.department,
    userId: user._id.toString()
  });

  res.json({
    status: 'success',
    message: 'User role updated successfully',
    data: { user }
  });
});

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user with populated sustainability data
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Calculate rank
  const higherRankedUsers = await User.countDocuments({
    'sustainabilityProfile.totalPoints': { $gt: user.sustainabilityProfile.totalPoints }
  });
  const rank = higherRankedUsers + 1;

  // Get department rank
  const higherRankedInDept = await User.countDocuments({
    department: user.department,
    'sustainabilityProfile.totalPoints': { $gt: user.sustainabilityProfile.totalPoints }
  });
  const departmentRank = higherRankedInDept + 1;

  // Calculate level progress
  const currentLevel = user.sustainabilityProfile.level;
  const pointsForCurrentLevel = (currentLevel - 1) * 100;
  const pointsForNextLevel = currentLevel * 100;
  const pointsInCurrentLevel = user.sustainabilityProfile.totalPoints - pointsForCurrentLevel;
  const levelProgress = (pointsInCurrentLevel / 100) * 100;

  res.json({
    status: 'success',
    data: {
      stats: {
        totalPoints: user.sustainabilityProfile.totalPoints,
        level: currentLevel,
        levelProgress,
        rank,
        departmentRank,
        badges: user.sustainabilityProfile.badges.length,
        achievements: user.sustainabilityProfile.achievements.length,
        activeGoals: user.sustainabilityProfile.goals.filter(g => g.status === 'active').length
      }
    }
  });
});

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Private
const getLeaderboard = asyncHandler(async (req, res) => {
  const { 
    type = 'global', // global, department, faculty
    limit = 10,
    timeframe = 'all' // all, month, week
  } = req.query;

  let query = { isActive: true };
  
  // Filter by type
  if (type === 'department') {
    query.department = req.user.department;
  } else if (type === 'faculty') {
    query.role = 'faculty';
  }

  // Get top users
  const users = await User.find(query)
    .select('displayName department role sustainabilityProfile.totalPoints sustainabilityProfile.level')
    .sort({ 'sustainabilityProfile.totalPoints': -1 })
    .limit(parseInt(limit))
    .lean();

  // Add rank to each user
  const leaderboard = users.map((user, index) => ({
    ...user,
    rank: index + 1
  }));

  res.json({
    status: 'success',
    data: {
      leaderboard,
      type,
      timeframe
    }
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getUserStats,
  getLeaderboard
};