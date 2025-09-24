const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');

// Temporary simplified dashboard route for testing
router.get('/', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard endpoint working',
    data: {
      energyConsumption: 1250.5,
      waterUsage: 850.0,
      wasteGenerated: 45.8,
      carbonEmissions: 425.3
    }
  });
}));

module.exports = router;

// Overview metrics
router.get('/overview', authenticateToken, dashboardController.getOverviewMetrics);

// Detailed metrics by category
router.get('/energy', authenticateToken, validateDateRange, handleValidationErrors, dashboardController.getEnergyMetrics);
router.get('/water', authenticateToken, validateDateRange, handleValidationErrors, dashboardController.getWaterMetrics);
router.get('/waste', authenticateToken, validateDateRange, handleValidationErrors, dashboardController.getWasteMetrics);
router.get('/mobility', authenticateToken, validateDateRange, handleValidationErrors, dashboardController.getMobilityMetrics);

// Net zero progress
router.get('/net-zero-progress', authenticateToken, dashboardController.getNetZeroProgress);

// Goals and targets
router.get('/goals', authenticateToken, dashboardController.getUserGoals);
router.post('/goals', authenticateToken, dashboardController.createGoal);
router.put('/goals/:id', authenticateToken, dashboardController.updateGoal);
router.delete('/goals/:id', authenticateToken, dashboardController.deleteGoal);

// Trends and analytics
router.get('/trends', authenticateToken, validateDateRange, handleValidationErrors, dashboardController.getTrends);
router.get('/comparisons', authenticateToken, dashboardController.getComparisons);

// Real-time data
router.get('/real-time', authenticateToken, dashboardController.getRealTimeData);

// Department analytics (Faculty and Admin only)
router.get('/department/:department', 
  authenticateToken, 
  authorizeRoles('faculty', 'admin'), 
  validateDateRange, 
  handleValidationErrors, 
  dashboardController.getDepartmentData
);

// Campus-wide analytics (Admin only)
router.get('/campus', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateDateRange, 
  handleValidationErrors, 
  dashboardController.getCampusData
);

// Export data
router.get('/export', 
  authenticateToken, 
  validateDateRange, 
  handleValidationErrors, 
  dashboardController.exportData
);

module.exports = router;