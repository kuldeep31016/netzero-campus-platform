const mongoose = require('mongoose');

const waterDataSchema = new mongoose.Schema({
  building: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['academic', 'residential', 'administrative', 'recreational', 'dining'],
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  consumption: {
    potable: {
      type: Number,
      required: true,
      min: 0
    },
    irrigation: {
      type: Number,
      default: 0,
      min: 0
    },
    cooling: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['gallons', 'liters', 'cubic_meters'],
      default: 'gallons'
    }
  },
  conservation: {
    rainwaterHarvested: {
      type: Number,
      default: 0,
      min: 0
    },
    recycledWater: {
      type: Number,
      default: 0,
      min: 0
    },
    greyWaterReused: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  metrics: {
    costPerGallon: {
      type: Number,
      default: 0.004 // Average US water cost per gallon
    },
    totalCost: {
      type: Number,
      default: 0
    },
    efficiency: {
      waterPerSquareFoot: {
        type: Number,
        default: 0
      },
      waterPerOccupant: {
        type: Number,
        default: 0
      }
    },
    leakageRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100 // percentage
    }
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual'],
      default: 'monthly'
    }
  },
  fixtures: [{
    type: {
      type: String,
      enum: ['faucet', 'toilet', 'shower', 'dishwasher', 'washing_machine', 'fountain', 'other']
    },
    count: Number,
    efficiency: {
      type: String,
      enum: ['low_flow', 'standard', 'high_efficiency', 'ultra_low_flow']
    },
    flowRate: Number, // gallons per minute or per flush
    usage: Number // estimated usage in gallons
  }],
  irrigation: {
    area: Number, // square feet
    type: {
      type: String,
      enum: ['drip', 'sprinkler', 'manual', 'smart_system']
    },
    schedule: {
      frequency: String,
      duration: Number,
      zones: Number
    },
    weatherResponsive: {
      type: Boolean,
      default: false
    }
  },
  qualityMetrics: {
    ph: Number,
    tds: Number, // Total Dissolved Solids
    chlorine: Number,
    hardness: Number,
    temperature: Number
  },
  goals: {
    targetReduction: {
      type: Number, // percentage
      default: 0
    },
    targetDate: Date,
    baselineYear: Number,
    baselineConsumption: Number
  },
  initiatives: [{
    name: String,
    description: String,
    startDate: Date,
    expectedSavings: Number, // gallons per month
    actualSavings: Number,
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned'
    }
  }],
  notes: {
    type: String,
    trim: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
waterDataSchema.index({ 'building.name': 1, 'period.startDate': -1 });
waterDataSchema.index({ 'period.type': 1, 'period.startDate': -1 });
waterDataSchema.index({ reportedBy: 1 });

// Pre-save middleware to calculate derived fields
waterDataSchema.pre('save', function(next) {
  // Ensure total consumption is sum of all categories
  this.consumption.total = this.consumption.potable + 
                          this.consumption.irrigation + 
                          this.consumption.cooling;
  
  // Calculate total cost
  this.metrics.totalCost = this.consumption.total * this.metrics.costPerGallon;
  
  next();
});

// Static methods for aggregation
waterDataSchema.statics.getTotalConsumption = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalConsumption: { $sum: '$consumption.total' },
        totalPotable: { $sum: '$consumption.potable' },
        totalIrrigation: { $sum: '$consumption.irrigation' },
        totalConserved: { 
          $sum: { 
            $add: ['$conservation.rainwaterHarvested', '$conservation.recycledWater', '$conservation.greyWaterReused'] 
          }
        },
        totalCost: { $sum: '$metrics.totalCost' },
        count: { $sum: 1 }
      }
    }
  ]);
};

waterDataSchema.statics.getConsumptionTrends = function(buildingName, period = 'monthly') {
  return this.aggregate([
    { $match: { 'building.name': buildingName, 'period.type': period } },
    { $sort: { 'period.startDate': 1 } },
    {
      $project: {
        date: '$period.startDate',
        total: '$consumption.total',
        potable: '$consumption.potable',
        irrigation: '$consumption.irrigation',
        conserved: {
          $add: ['$conservation.rainwaterHarvested', '$conservation.recycledWater', '$conservation.greyWaterReused']
        },
        cost: '$metrics.totalCost'
      }
    }
  ]);
};

waterDataSchema.statics.getEfficiencyMetrics = function(buildingType) {
  return this.aggregate([
    { $match: { 'building.type': buildingType } },
    {
      $group: {
        _id: '$building.type',
        avgWaterPerSqFt: { $avg: '$metrics.efficiency.waterPerSquareFoot' },
        avgWaterPerOccupant: { $avg: '$metrics.efficiency.waterPerOccupant' },
        avgLeakageRate: { $avg: '$metrics.leakageRate' },
        totalBuildings: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('WaterData', waterDataSchema);