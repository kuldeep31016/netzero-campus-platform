const express = require('express');
const router = express.Router();

// Mock gamification controller functions
const getChallenges = async (req, res) => {
  const mockChallenges = [
    {
      id: '1',
      title: 'Energy Saver Challenge',
      description: 'Reduce energy consumption by 20%',
      type: 'energy',
      target: 20,
      progress: 65,
      participants: 127,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      rewards: ['Energy Star Badge', '50 points']
    },
    {
      id: '2',
      title: 'Water Conservation Week',
      description: 'Save 100L of water this week',
      type: 'water',
      target: 100,
      progress: 45,
      participants: 89,
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      rewards: ['Water Guardian Badge', '30 points']
    }
  ];

  res.json({
    success: true,
    data: mockChallenges,
    message: 'Challenges retrieved successfully'
  });
};

const getUserBadges = async (req, res) => {
  const mockBadges = [
    {
      id: '1',
      name: 'Energy Star',
      description: 'Awarded for exceptional energy savings',
      icon: '🌟',
      earnedAt: '2024-01-10',
      category: 'energy'
    },
    {
      id: '2',
      name: 'Water Guardian',
      description: 'Completed water conservation challenge',
      icon: '💧',
      earnedAt: '2024-01-05',
      category: 'water'
    }
  ];

  res.json({
    success: true,
    data: mockBadges,
    message: 'User badges retrieved successfully'
  });
};

const getLeaderboard = async (req, res) => {
  const mockLeaderboard = [
    {
      rank: 1,
      user: 'Alice Johnson',
      points: 1250,
      achievements: 12,
      energySaved: 156.7
    },
    {
      rank: 2,
      user: 'Bob Smith',
      points: 1180,
      achievements: 10,
      energySaved: 142.3
    },
    {
      rank: 3,
      user: 'Carol Davis',
      points: 1095,
      achievements: 9,
      energySaved: 128.9
    }
  ];

  res.json({
    success: true,
    data: mockLeaderboard,
    message: 'Leaderboard retrieved successfully'
  });
};

const joinChallenge = async (req, res) => {
  const { challengeId } = req.params;
  
  res.json({
    success: true,
    data: { challengeId, joined: true },
    message: 'Successfully joined challenge'
  });
};

// Routes
router.get('/challenges', getChallenges);
router.get('/badges', getUserBadges);
router.get('/leaderboard', getLeaderboard);
router.post('/challenges/:challengeId/join', joinChallenge);

module.exports = router;