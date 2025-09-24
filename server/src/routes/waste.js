const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

// Mock waste controller functions
const getWasteData = asyncHandler(async (req, res) => {
  const mockData = [
    {
      id: '1',
      building: 'Main Building',
      amount: 45.2,
      timestamp: new Date().toISOString(),
      type: 'recyclable',
      category: 'paper'
    },
    {
      id: '2',
      building: 'Cafeteria',
      amount: 125.8,
      timestamp: new Date().toISOString(),
      type: 'organic',
      category: 'food_waste'
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Waste data retrieved successfully'
  });
});

const addWasteReading = asyncHandler(async (req, res) => {
  const { building, amount, type, category } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    building,
    amount,
    type,
    category,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Waste reading added successfully'
  });
});

// Routes
router.get('/', getWasteData);
router.post('/', addWasteReading);

module.exports = router;