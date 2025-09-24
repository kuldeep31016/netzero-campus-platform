const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock mobility controller functions
const getMobilityData = asyncHandler(async (req, res) => {
  const mockData = [
    {
      id: '1',
      user: 'student123',
      transportType: 'bicycle',
      distance: 5.2,
      carbonSaved: 1.2,
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      user: 'faculty456',
      transportType: 'electric_bus',
      distance: 12.5,
      carbonSaved: 8.5,
      timestamp: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Mobility data retrieved successfully'
  });
});

const addMobilityReading = asyncHandler(async (req, res) => {
  const { user, transportType, distance, carbonSaved } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    user,
    transportType,
    distance,
    carbonSaved,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Mobility reading added successfully'
  });
});

// Routes
router.get('/', getMobilityData);
router.post('/', addMobilityReading);

module.exports = router;