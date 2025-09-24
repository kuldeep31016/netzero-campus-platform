const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock gamification controller functions
const getChallenges = asyncHandler(async (req, res) => {
  const mockChallenges = [
    {
      id: '1',
      title: 'Energy Conservation Challenge',
      description: 'Reduce energy consumption by 10% this month',
      points: 500,
      participants: 143,
      deadline: '2024-01-31',
      status: 'active',
      category: 'energy'
    },
    {
      id: '2',
      title: 'Water Saving Week',
      description: 'Save 20% water usage in dormitories',
      points: 300,
      participants: 87,
      deadline: '2024-01-25',
      status: 'active',
      category: 'water'
    }
  ];

  res.json({
    success: true,
    data: mockChallenges,
    message: 'Challenges retrieved successfully'
  });
});

const getLeaderboard = asyncHandler(async (req, res) => {
  const mockLeaderboard = [
    {
      rank: 1,
      user: 'Alice Johnson',
      points: 2850,
      badges: 12,
      department: 'Engineering'
    },
    {
      rank: 2,
      user: 'Bob Smith',
      points: 2340,
      badges: 8,
      department: 'Business'
    },
    {
      rank: 3,
      user: 'Carol Davis',
      points: 2100,
      badges: 10,
      department: 'Sciences'
    }
  ];

  res.json({
    success: true,
    data: mockLeaderboard,
    message: 'Leaderboard retrieved successfully'
  });
});

const getBadges = asyncHandler(async (req, res) => {
  const mockBadges = [
    {
      id: '1',
      name: 'Energy Saver',
      description: 'Reduced energy consumption by 15%',
      icon: '⚡',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Water Guardian',
      description: 'Saved 100+ liters of water',
      icon: '💧',
      earned: false,
      progress: 75
    }
  ];

  res.json({
    success: true,
    data: mockBadges,
    message: 'Badges retrieved successfully'
  });
});

// Routes
router.get('/challenges', getChallenges);
router.get('/leaderboard', getLeaderboard);
router.get('/badges', getBadges);

module.exports = router;