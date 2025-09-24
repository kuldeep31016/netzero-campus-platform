const express = require('express');
const router = express.Router();

// Mock waste controller functions
const getWasteData = async (req, res) => {
  const mockData = [
    {
      id: '1',
      building: 'Main Building',
      generated: 45.8,
      recycled: 38.2,
      timestamp: new Date().toISOString(),
      type: 'general'
    },
    {
      id: '2',
      building: 'Cafeteria',
      generated: 25.3,
      recycled: 18.7,
      timestamp: new Date().toISOString(),
      type: 'organic'
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Waste data retrieved successfully'
  });
};

const addWasteReading = async (req, res) => {
  const { building, generated, recycled, type } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    building,
    generated,
    recycled,
    type,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Waste reading added successfully'
  });
};

// Routes
router.get('/', getWasteData);
router.post('/', addWasteReading);

module.exports = router;