const mongoose = require('mongoose');

const wasteDataSchema = new mongoose.Schema({
  building: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['academic', 'residential', 'administrative', 'dining', 'laboratory'],
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  waste: {
    general: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      destination: {
        type: String,
        enum: ['landfill', 'incineration', 'composting'],
        default: 'landfill'
      }
    },
    recyclable: {
      paper: {
        type: Number,
        default: 0,
        min: 0
      },
      plastic: {
        type: Number,
        default: 0,
        min: 0
      },
      glass: {
        type: Number,
        default: 0,
        min: 0
      },
      metal: {
        type: Number,
        default: 0,
        min: 0
      },
      electronics: {
        type: Number,
        default: 0,
        min: 0
      },
      cardboard: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    organic: {
      food: {
        type: Number,
        default: 0,
        min: 0
      },
      yard: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    hazardous: {
      chemical: {
        type: Number,
        default: 0,
        min: 0
      },
      medical: {
        type: Number,
        default: 0,
        min: 0
      },
      battery: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    unit: {
      type: String,
      enum: ['lbs', 'kg', 'tons'],
      default: 'lbs'
    }
  },
  metrics: {
    totalWaste: {
      type: Number,
      default: 0
    },
    totalRecycled: {
      type: Number,
      default: 0
    },
    totalComposted: {
      type: Number,
      default: 0
    },
    recyclingRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100 // percentage
    },
    diversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100 // percentage (recycled + composted / total)
    },
    wastePerOccupant: {
      type: Number,
      default: 0
    },
    costPerTon: {
      type: Number,
      default: 50 // average disposal cost
    },
    totalDisposalCost: {
      type: Number,
      default: 0
    },
    carbonFootprint: {
      type: Number, // kg CO2 equivalent
      default: 0
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
  programs: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['recycling', 'composting', 'reduction', 'reuse', 'education']
    },
    description: String,
    startDate: Date,
    participants: Number,
    impact: {
      wasteReduced: Number,
      costSavings: Number,
      co2Reduced: Number
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active'
    }
  }],
  equipment: [{
    type: {
      type: String,
      enum: ['recycling_bin', 'compost_bin', 'compactor', 'shredder', 'other']
    },
    count: Number,
    capacity: Number, // in same unit as waste
    location: String,
    lastEmptied: Date,
    fillLevel: {
      type: Number,
      min: 0,
      max: 100 // percentage
    }
  }],
  goals: {
    wasteReductionTarget: {
      type: Number, // percentage
      default: 0
    },
    recyclingRateTarget: {
      type: Number, // percentage
      default: 50
    },
    diversionRateTarget: {
      type: Number, // percentage
      default: 75
    },
    targetDate: Date,
    baselineYear: Number,
    baselineWaste: Number
  },
  vendor: {
    name: String,
    contact: String,
    services: [String],
    contract: {
      startDate: Date,
      endDate: Date,
      costStructure: String
    }
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
wasteDataSchema.index({ 'building.name': 1, 'period.startDate': -1 });
wasteDataSchema.index({ 'period.type': 1, 'period.startDate': -1 });
wasteDataSchema.index({ reportedBy: 1 });

// Pre-save middleware to calculate derived fields
wasteDataSchema.pre('save', function(next) {
  // Calculate totals
  const recyclableTotal = Object.values(this.waste.recyclable).reduce((sum, val) => sum + (val || 0), 0);
  const organicTotal = Object.values(this.waste.organic).reduce((sum, val) => sum + (val || 0), 0);
  const hazardousTotal = Object.values(this.waste.hazardous).reduce((sum, val) => sum + (val || 0), 0);
  
  this.metrics.totalRecycled = recyclableTotal;
  this.metrics.totalComposted = organicTotal;
  this.metrics.totalWaste = this.waste.general.amount + recyclableTotal + organicTotal + hazardousTotal;
  
  // Calculate rates
  if (this.metrics.totalWaste > 0) {
    this.metrics.recyclingRate = (recyclableTotal / this.metrics.totalWaste) * 100;
    this.metrics.diversionRate = ((recyclableTotal + organicTotal) / this.metrics.totalWaste) * 100;
  }
  
  // Calculate costs and carbon footprint
  this.metrics.totalDisposalCost = (this.metrics.totalWaste / 2000) * this.metrics.costPerTon; // convert lbs to tons
  
  // Carbon footprint calculations (rough estimates in kg CO2)
  const landfillFactor = 0.5; // kg CO2 per lb
  const recyclingFactor = -0.2; // negative because recycling saves emissions
  const compostingFactor = -0.1;
  
  this.metrics.carbonFootprint = 
    (this.waste.general.amount * landfillFactor) +
    (recyclableTotal * recyclingFactor) +
    (organicTotal * compostingFactor);
  
  next();
});

// Static methods for aggregation
wasteDataSchema.statics.getTotalWaste = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalWaste: { $sum: '$metrics.totalWaste' },
        totalRecycled: { $sum: '$metrics.totalRecycled' },
        totalComposted: { $sum: '$metrics.totalComposted' },
        avgRecyclingRate: { $avg: '$metrics.recyclingRate' },
        avgDiversionRate: { $avg: '$metrics.diversionRate' },
        totalCost: { $sum: '$metrics.totalDisposalCost' },
        totalCarbonFootprint: { $sum: '$metrics.carbonFootprint' },
        count: { $sum: 1 }
      }
    }
  ]);
};

wasteDataSchema.statics.getWasteTrends = function(buildingName, period = 'monthly') {
  return this.aggregate([
    { $match: { 'building.name': buildingName, 'period.type': period } },
    { $sort: { 'period.startDate': 1 } },
    {
      $project: {
        date: '$period.startDate',
        totalWaste: '$metrics.totalWaste',
        recycled: '$metrics.totalRecycled',
        composted: '$metrics.totalComposted',
        recyclingRate: '$metrics.recyclingRate',
        diversionRate: '$metrics.diversionRate',
        cost: '$metrics.totalDisposalCost'
      }
    }
  ]);
};

wasteDataSchema.statics.getRecyclingBreakdown = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        paper: { $sum: '$waste.recyclable.paper' },
        plastic: { $sum: '$waste.recyclable.plastic' },
        glass: { $sum: '$waste.recyclable.glass' },
        metal: { $sum: '$waste.recyclable.metal' },
        electronics: { $sum: '$waste.recyclable.electronics' },
        cardboard: { $sum: '$waste.recyclable.cardboard' }
      }
    }
  ]);
};

module.exports = mongoose.model('WasteData', wasteDataSchema);