const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  building: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['academic', 'residential', 'administrative', 'recreational', 'laboratory'],
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  consumption: {
    electricity: {
      total: {
        type: Number,
        required: true,
        min: 0
      },
      renewable: {
        type: Number,
        default: 0,
        min: 0
      },
      nonRenewable: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        enum: ['kWh', 'MWh', 'GWh'],
        default: 'kWh'
      }
    },
    heating: {
      naturalGas: {
        type: Number,
        default: 0,
        min: 0
      },
      electricity: {
        type: Number,
        default: 0,
        min: 0
      },
      unit: {
        type: String,
        enum: ['kWh', 'therms', 'BTU'],
        default: 'kWh'
      }
    },
    cooling: {
      electricity: {
        type: Number,
        default: 0,
        min: 0
      },
      unit: {
        type: String,
        enum: ['kWh', 'tons'],
        default: 'kWh'
      }
    }
  },
  metrics: {
    costPerKwh: {
      type: Number,
      default: 0.12
    },
    totalCost: {
      type: Number,
      default: 0
    },
    carbonFootprint: {
      type: Number, // kg CO2
      default: 0
    },
    efficiency: {
      energyPerSquareFoot: {
        type: Number,
        default: 0
      },
      energyPerOccupant: {
        type: Number,
        default: 0
      }
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
  weather: {
    averageTemperature: Number,
    heatingDegreeDays: Number,
    coolingDegreeDays: Number
  },
  occupancy: {
    averageOccupants: Number,
    peakOccupants: Number,
    operatingHours: Number
  },
  equipment: [{
    type: {
      type: String,
      enum: ['HVAC', 'lighting', 'computers', 'appliances', 'laboratory', 'other']
    },
    count: Number,
    efficiency: String,
    energyRating: String
  }],
  goals: {
    targetReduction: {
      type: Number, // percentage
      default: 0
    },
    targetDate: Date,
    baselineYear: Number,
    baselineConsumption: Number
  },
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
energyDataSchema.index({ 'building.name': 1, 'period.startDate': -1 });
energyDataSchema.index({ 'period.type': 1, 'period.startDate': -1 });
energyDataSchema.index({ reportedBy: 1 });

// Pre-save middleware to calculate derived fields
energyDataSchema.pre('save', function(next) {
  // Calculate total cost
  this.metrics.totalCost = this.consumption.electricity.total * this.metrics.costPerKwh;
  
  // Calculate carbon footprint (kg CO2 per kWh varies by region, using US average)
  const carbonIntensity = 0.4; // kg CO2 per kWh (US average)
  this.metrics.carbonFootprint = this.consumption.electricity.total * carbonIntensity;
  
  // Ensure nonRenewable + renewable = total
  if (this.consumption.electricity.renewable) {
    this.consumption.electricity.nonRenewable = 
      this.consumption.electricity.total - this.consumption.electricity.renewable;
  }
  
  next();
});

// Static methods for aggregation
energyDataSchema.statics.getTotalConsumption = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalElectricity: { $sum: '$consumption.electricity.total' },
        totalRenewable: { $sum: '$consumption.electricity.renewable' },
        totalCost: { $sum: '$metrics.totalCost' },
        totalCarbonFootprint: { $sum: '$metrics.carbonFootprint' },
        count: { $sum: 1 }
      }
    }
  ]);
};

energyDataSchema.statics.getConsumptionTrends = function(buildingName, period = 'monthly') {
  return this.aggregate([
    { $match: { 'building.name': buildingName, 'period.type': period } },
    { $sort: { 'period.startDate': 1 } },
    {
      $project: {
        date: '$period.startDate',
        total: '$consumption.electricity.total',
        renewable: '$consumption.electricity.renewable',
        cost: '$metrics.totalCost',
        carbonFootprint: '$metrics.carbonFootprint'
      }
    }
  ]);
};

module.exports = mongoose.model('EnergyData', energyDataSchema);