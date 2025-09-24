const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock water controller functions
const getWaterData = asyncHandler(async (req, res) => {
  const mockData = [
    {
      id: '1',
      building: 'Main Building',
      usage: 850.0,
      timestamp: new Date().toISOString(),
      type: 'consumption'
    },
    {
      id: '2',
      building: 'Dormitory A',
      usage: 420.5,
      timestamp: new Date().toISOString(),
      type: 'consumption'
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Water data retrieved successfully'
  });
});

const addWaterReading = asyncHandler(async (req, res) => {
  const { building, usage, type } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    building,
    usage,
    type,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Water reading added successfully'
  });
});

// Routes
router.get('/', getWaterData);
router.post('/', addWaterReading);

module.exports = router;