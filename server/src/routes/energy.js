const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock energy controller functions
const getEnergyData = asyncHandler(async (req, res) => {
  const mockData = [
    {
      id: '1',
      building: 'Main Building',
      consumption: 1250.5,
      timestamp: new Date().toISOString(),
      type: 'electricity'
    },
    {
      id: '2', 
      building: 'Library',
      consumption: 850.2,
      timestamp: new Date().toISOString(),
      type: 'electricity'
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Energy data retrieved successfully'
  });
});

const addEnergyReading = asyncHandler(async (req, res) => {
  const { building, consumption, type } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    building,
    consumption,
    type,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Energy reading added successfully'
  });
});

// Routes
router.get('/', getEnergyData);
router.post('/', addEnergyReading);

module.exports = router;