const { body, param, query, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Common validations
const validateId = param('id').isMongoId().withMessage('Invalid ID format');

const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sortBy').optional().isString().withMessage('SortBy must be a string'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder must be asc or desc')
];

const validateDateRange = [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date')
];

// User validation
const validateUser = [
  body('displayName').trim().isLength({ min: 2, max: 100 }).withMessage('Display name must be 2-100 characters'),
  body('department').trim().isLength({ min: 2, max: 100 }).withMessage('Department must be 2-100 characters'),
  body('role').optional().isIn(['admin', 'faculty', 'student']).withMessage('Invalid role')
];

// Energy data validation
const validateEnergyData = [
  body('building.name').trim().isLength({ min: 1, max: 100 }).withMessage('Building name is required'),
  body('building.type').isIn(['academic', 'residential', 'administrative', 'recreational', 'laboratory']).withMessage('Invalid building type'),
  body('building.location').trim().isLength({ min: 1, max: 200 }).withMessage('Building location is required'),
  body('consumption.electricity.total').isFloat({ min: 0 }).withMessage('Total electricity consumption must be non-negative'),
  body('consumption.electricity.renewable').optional().isFloat({ min: 0 }).withMessage('Renewable electricity must be non-negative'),
  body('consumption.electricity.nonRenewable').isFloat({ min: 0 }).withMessage('Non-renewable electricity must be non-negative'),
  body('period.startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('period.endDate').isISO8601().withMessage('End date must be a valid ISO date'),
  body('period.type').optional().isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annual']).withMessage('Invalid period type')
];

// Water data validation
const validateWaterData = [
  body('building.name').trim().isLength({ min: 1, max: 100 }).withMessage('Building name is required'),
  body('building.type').isIn(['academic', 'residential', 'administrative', 'recreational', 'dining']).withMessage('Invalid building type'),
  body('building.location').trim().isLength({ min: 1, max: 200 }).withMessage('Building location is required'),
  body('consumption.potable').isFloat({ min: 0 }).withMessage('Potable water consumption must be non-negative'),
  body('consumption.irrigation').optional().isFloat({ min: 0 }).withMessage('Irrigation water must be non-negative'),
  body('consumption.cooling').optional().isFloat({ min: 0 }).withMessage('Cooling water must be non-negative'),
  body('period.startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('period.endDate').isISO8601().withMessage('End date must be a valid ISO date')
];

// Waste data validation
const validateWasteData = [
  body('building.name').trim().isLength({ min: 1, max: 100 }).withMessage('Building name is required'),
  body('building.type').isIn(['academic', 'residential', 'administrative', 'dining', 'laboratory']).withMessage('Invalid building type'),
  body('building.location').trim().isLength({ min: 1, max: 200 }).withMessage('Building location is required'),
  body('waste.general.amount').isFloat({ min: 0 }).withMessage('General waste amount must be non-negative'),
  body('waste.recyclable.paper').optional().isFloat({ min: 0 }).withMessage('Paper waste must be non-negative'),
  body('waste.recyclable.plastic').optional().isFloat({ min: 0 }).withMessage('Plastic waste must be non-negative'),
  body('waste.recyclable.glass').optional().isFloat({ min: 0 }).withMessage('Glass waste must be non-negative'),
  body('waste.recyclable.metal').optional().isFloat({ min: 0 }).withMessage('Metal waste must be non-negative'),
  body('period.startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('period.endDate').isISO8601().withMessage('End date must be a valid ISO date')
];

// Mobility data validation
const validateMobilityData = [
  body('period.startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('period.endDate').isISO8601().withMessage('End date must be a valid ISO date'),
  body('transportation').isArray({ min: 1 }).withMessage('At least one transportation entry is required'),
  body('transportation.*.mode').isIn([
    'walking', 'cycling', 'public_transit', 'carpool', 'personal_vehicle', 
    'electric_vehicle', 'hybrid_vehicle', 'motorcycle', 'other'
  ]).withMessage('Invalid transportation mode'),
  body('transportation.*.purpose').isIn(['commute', 'campus_travel', 'business_travel', 'personal']).withMessage('Invalid transportation purpose'),
  body('transportation.*.distance').isFloat({ min: 0 }).withMessage('Distance must be non-negative'),
  body('transportation.*.frequency').isInt({ min: 1 }).withMessage('Frequency must be at least 1')
];

// Challenge validation
const validateChallenge = [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
  body('type').isIn(['individual', 'department', 'campus_wide']).withMessage('Invalid challenge type'),
  body('category').isIn(['energy', 'water', 'waste', 'mobility', 'general']).withMessage('Invalid category'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('duration.startDate').isISO8601().withMessage('Start date must be a valid ISO date'),
  body('duration.endDate').isISO8601().withMessage('End date must be a valid ISO date'),
  body('goals.target').isFloat({ min: 0 }).withMessage('Target must be non-negative'),
  body('goals.unit').trim().isLength({ min: 1, max: 50 }).withMessage('Unit is required'),
  body('rewards.points').isInt({ min: 0 }).withMessage('Points must be non-negative integer')
];

// Badge validation
const validateBadge = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Badge name must be 2-100 characters'),
  body('description').trim().isLength({ min: 10, max: 300 }).withMessage('Description must be 10-300 characters'),
  body('category').isIn(['energy', 'water', 'waste', 'mobility', 'general', 'special']).withMessage('Invalid category'),
  body('type').optional().isIn(['achievement', 'milestone', 'participation', 'leadership', 'innovation']).withMessage('Invalid badge type'),
  body('rarity').optional().isIn(['common', 'uncommon', 'rare', 'epic', 'legendary']).withMessage('Invalid rarity'),
  body('criteria.type').isIn(['points', 'metric', 'participation', 'challenge', 'streak', 'special']).withMessage('Invalid criteria type'),
  body('criteria.requirement.value').isFloat({ min: 0 }).withMessage('Requirement value must be non-negative')
];

// Custom validator for date range
const validateDateRangeLogic = (req, res, next) => {
  const { startDate, endDate } = req.body.period || req.query;
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        status: 'error',
        message: 'End date must be after start date'
      });
    }
    
    // Check if date range is reasonable (not too far in the future)
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
    
    if (end > maxFutureDate) {
      return res.status(400).json({
        status: 'error',
        message: 'End date cannot be more than 1 year in the future'
      });
    }
  }
  
  next();
};

// Validate building exists and user has access
const validateBuildingAccess = async (req, res, next) => {
  try {
    const buildingName = req.body.building?.name;
    
    if (!buildingName) {
      return next();
    }

    // Here you would typically check against a buildings database
    // For now, we'll just ensure the building name is reasonable
    const validBuildingPattern = /^[a-zA-Z0-9\s\-_\.]+$/;
    
    if (!validBuildingPattern.test(buildingName)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid building name format'
      });
    }

    next();
  } catch (error) {
    console.error('Building validation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error validating building access'
    });
  }
};

module.exports = {
  handleValidationErrors,
  validateId,
  validatePagination,
  validateDateRange,
  validateUser,
  validateEnergyData,
  validateWaterData,
  validateWasteData,
  validateMobilityData,
  validateChallenge,
  validateBadge,
  validateDateRangeLogic,
  validateBuildingAccess
};