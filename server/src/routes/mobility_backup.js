const express = require('express');
const router = express.Router();

// Mock mobility controller functions
const getMobilityData = async (req, res) => {
  const mockData = [
    {
      id: '1',
      user: 'demo-user',
      mode: 'bicycle',
      distance: 5.2,
      carbonSaved: 1.2,
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      user: 'demo-user',
      mode: 'walking',
      distance: 2.1,
      carbonSaved: 0.5,
      timestamp: new Date().toISOString()
    }
  ];

  res.json({
    success: true,
    data: mockData,
    message: 'Mobility data retrieved successfully'
  });
};

const addMobilityReading = async (req, res) => {
  const { mode, distance, carbonSaved } = req.body;
  
  const newReading = {
    id: Date.now().toString(),
    user: 'demo-user',
    mode,
    distance,
    carbonSaved,
    timestamp: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newReading,
    message: 'Mobility reading added successfully'
  });
};

// Routes
router.get('/', getMobilityData);
router.post('/', addMobilityReading);

module.exports = router;