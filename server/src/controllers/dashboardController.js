const asyncHandler = require('../utils/asyncHandler');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const { range = '7d' } = req.query;
  
  // Mock data for development - replace with actual database queries
  const mockStats = {
    energyConsumption: 1250.5,
    energySaved: 180.2,
    waterUsage: 850.0,
    waterSaved: 95.5,
    wasteGenerated: 45.8,
    wasteRecycled: 38.2,
    carbonEmissions: 425.3,
    carbonOffset: 67.8,
    lastUpdated: new Date().toISOString()
  };

  res.json({
    success: true,
    data: mockStats,
    message: `Dashboard stats for ${range} retrieved successfully`
  });
});

// @desc    Get dashboard chart data
// @route   GET /api/dashboard/chart
// @access  Private
const getDashboardChartData = asyncHandler(async (req, res) => {
  const { range = '7d', metric = 'energy' } = req.query;
  
  // Mock chart data for development
  const mockChartData = [
    { date: '2024-01-01', energy: 120, water: 80, waste: 45, carbon: 42 },
    { date: '2024-01-02', energy: 115, water: 85, waste: 38, carbon: 39 },
    { date: '2024-01-03', energy: 125, water: 82, waste: 42, carbon: 44 },
    { date: '2024-01-04', energy: 110, water: 78, waste: 36, carbon: 38 },
    { date: '2024-01-05', energy: 118, water: 88, waste: 40, carbon: 41 },
    { date: '2024-01-06', energy: 122, water: 84, waste: 44, carbon: 43 },
    { date: '2024-01-07', energy: 108, water: 76, waste: 35, carbon: 36 },
  ];

  res.json({
    success: true,
    data: mockChartData,
    message: `Chart data for ${metric} (${range}) retrieved successfully`
  });
});

// @desc    Get real-time dashboard updates
// @route   GET /api/dashboard/realtime
// @access  Private
const getRealtimeUpdates = asyncHandler(async (req, res) => {
  // Mock real-time data
  const realtimeData = {
    currentPowerUsage: Math.floor(Math.random() * 500) + 800, // 800-1300 kW
    currentWaterFlow: Math.floor(Math.random() * 50) + 20, // 20-70 L/min
    activeUsers: Math.floor(Math.random() * 50) + 150, // 150-200 users
    systemStatus: 'operational',
    lastUpdate: new Date().toISOString()
  };

  res.json({
    success: true,
    data: realtimeData,
    message: 'Real-time data retrieved successfully'
  });
});

module.exports = {
  getDashboardStats,
  getDashboardChartData,
  getRealtimeUpdates
};