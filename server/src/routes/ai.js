const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock AI controller functions
const getRecommendations = asyncHandler(async (req, res) => {
  const mockRecommendations = [
    {
      id: '1',
      title: 'Optimize HVAC Schedule',
      description: 'Adjust heating/cooling schedule based on occupancy patterns to save 15% energy',
      category: 'energy',
      impact: 'high',
      effort: 'medium',
      estimatedSavings: '1,200 kWh/month',
      confidence: 0.87
    },
    {
      id: '2',
      title: 'Implement Smart Water Fixtures',
      description: 'Install motion-sensor faucets in high-traffic areas to reduce water waste',
      category: 'water',
      impact: 'medium',
      effort: 'high',
      estimatedSavings: '2,500 L/month',
      confidence: 0.92
    },
    {
      id: '3',
      title: 'Enhanced Recycling Program',
      description: 'Deploy smart bins with sensors to improve recycling rates',
      category: 'waste',
      impact: 'medium',
      effort: 'low',
      estimatedSavings: '25% waste reduction',
      confidence: 0.78
    }
  ];

  res.json({
    success: true,
    data: mockRecommendations,
    message: 'AI recommendations retrieved successfully'
  });
});

const getInsights = asyncHandler(async (req, res) => {
  const mockInsights = [
    {
      id: '1',
      type: 'trend',
      title: 'Energy Usage Trending Down',
      description: 'Campus energy consumption has decreased by 8% over the last 30 days',
      severity: 'positive',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Water Usage Detected',
      description: 'Building C shows 40% higher water consumption than normal - possible leak',
      severity: 'warning',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Carbon Goal Achievement',
      description: 'Based on current trends, you\'re on track to meet carbon reduction goals by 95%',
      severity: 'info',
      timestamp: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockInsights,
    message: 'AI insights retrieved successfully'
  });
});

const getPredictions = asyncHandler(async (req, res) => {
  const mockPredictions = {
    nextMonth: {
      energy: { value: 125000, change: -5.2 },
      water: { value: 45000, change: -3.1 },
      waste: { value: 2800, change: -8.7 },
      carbon: { value: 89000, change: -6.3 }
    },
    goals: {
      carbonReduction: { target: 25, current: 18.5, probability: 0.85 },
      energySaving: { target: 20, current: 16.2, probability: 0.92 },
      wasteReduction: { target: 30, current: 22.1, probability: 0.78 }
    }
  };

  res.json({
    success: true,
    data: mockPredictions,
    message: 'AI predictions retrieved successfully'
  });
});

// Routes
router.get('/recommendations', getRecommendations);
router.get('/insights', getInsights);
router.get('/predictions', getPredictions);

module.exports = router;