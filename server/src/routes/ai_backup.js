const express = require('express');
const router = express.Router();

// Mock AI controller functions
const getRecommendations = async (req, res) => {
  const mockRecommendations = [
    {
      id: '1',
      category: 'energy',
      title: 'Optimize Heating Schedule',
      description: 'Based on your usage patterns, you could save 15% energy by adjusting heating schedules during low-occupancy hours.',
      impact: 'High',
      savings: '15% energy reduction',
      difficulty: 'Easy',
      steps: [
        'Review current heating schedule',
        'Identify low-occupancy periods',
        'Adjust thermostat settings',
        'Monitor results for 2 weeks'
      ],
      estimatedSavings: {
        energy: 187.5,
        cost: 45.20,
        carbon: 89.3
      }
    },
    {
      id: '2',
      category: 'water',
      title: 'Install Low-Flow Fixtures',
      description: 'Upgrading to low-flow faucets and showerheads could reduce water consumption by 25%.',
      impact: 'Medium',
      savings: '25% water reduction',
      difficulty: 'Medium',
      steps: [
        'Audit current water fixtures',
        'Calculate potential savings',
        'Purchase low-flow alternatives',
        'Schedule installation'
      ],
      estimatedSavings: {
        water: 212.5,
        cost: 78.90,
        carbon: 23.8
      }
    },
    {
      id: '3',
      category: 'waste',
      title: 'Implement Composting Program',
      description: 'A composting program could divert 40% of organic waste from landfills.',
      impact: 'High',
      savings: '40% waste reduction',
      difficulty: 'Hard',
      steps: [
        'Set up composting bins',
        'Train staff and students',
        'Create collection schedule',
        'Monitor and maintain system'
      ],
      estimatedSavings: {
        waste: 18.3,
        cost: 156.00,
        carbon: 67.2
      }
    }
  ];

  res.json({
    success: true,
    data: mockRecommendations,
    message: 'AI recommendations retrieved successfully'
  });
};

const getInsights = async (req, res) => {
  const mockInsights = {
    trends: {
      energy: {
        trend: 'decreasing',
        change: -12.5,
        period: 'last 30 days'
      },
      water: {
        trend: 'stable',
        change: 2.1,
        period: 'last 30 days'
      },
      waste: {
        trend: 'decreasing',
        change: -8.7,
        period: 'last 30 days'
      }
    },
    predictions: {
      nextMonth: {
        energy: 1125.3,
        water: 867.2,
        waste: 42.1
      },
      confidenceLevel: 87
    },
    alerts: [
      {
        type: 'warning',
        message: 'Energy consumption spike detected in Building A',
        timestamp: new Date().toISOString()
      }
    ]
  };

  res.json({
    success: true,
    data: mockInsights,
    message: 'AI insights retrieved successfully'
  });
};

// Routes
router.get('/recommendations', getRecommendations);
router.get('/insights', getInsights);

module.exports = router;