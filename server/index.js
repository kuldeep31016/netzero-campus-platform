const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test API routes
app.get('/', (req, res) => {
  res.json({
    message: 'Net Zero Campus Platform API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Test data endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Test API endpoint working!',
    data: {
      users: 150,
      energySaved: 2500,
      co2Reduced: 1200
    },
    success: true
  });
});

// Sample POST endpoint
app.post('/api/test', (req, res) => {
  const { name, value } = req.body;
  
  res.json({
    message: 'Data received successfully!',
    received: {
      name: name || 'No name provided',
      value: value || 'No value provided',
      timestamp: new Date().toISOString()
    },
    success: true
  });
});

// Energy data mock endpoint
app.get('/api/energy', (req, res) => {
  res.json({
    totalConsumption: 45000,
    renewableEnergy: 28000,
    carbonFootprint: 12.5,
    buildings: [
      { name: 'Main Building', consumption: 15000, efficiency: 85 },
      { name: 'Science Block', consumption: 18000, efficiency: 78 },
      { name: 'Library', consumption: 12000, efficiency: 92 }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🧪 Test API available at http://localhost:${PORT}/api/test`);
});

module.exports = app;