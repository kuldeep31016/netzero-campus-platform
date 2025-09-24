const mongoose = require('mongoose');

const mobilityDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
      enum: ['daily', 'weekly', 'monthly'],
      default: 'monthly'
    }
  },
  transportation: [{
    mode: {
      type: String,
      enum: [
        'walking',
        'cycling',
        'public_transit',
        'carpool',
        'personal_vehicle',
        'electric_vehicle',
        'hybrid_vehicle',
        'motorcycle',
        'other'
      ],
      required: true
    },
    purpose: {
      type: String,
      enum: ['commute', 'campus_travel', 'business_travel', 'personal'],
      required: true
    },
    distance: {
      type: Number,
      required: true,
      min: 0 // miles
    },
    frequency: {
      type: Number,
      required: true,
      min: 1 // trips per period
    },
    passengers: {
      type: Number,
      default: 1,
      min: 1
    },
    vehicle: {
      type: String,
      fuelType: {
        type: String,
        enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'hydrogen', 'cng']
      },
      fuelEfficiency: Number, // MPG or equivalent
      model: String,
      year: Number
    },
    route: {
      origin: String,
      destination: String,
      routeType: {
        type: String,
        enum: ['direct', 'highway', 'city', 'mixed']
      }
    },
    cost: {
      fuel: {
        type: Number,
        default: 0
      },
      parking: {
        type: Number,
        default: 0
      },
      tolls: {
        type: Number,
        default: 0
      },
      transit: {
        type: Number,
        default: 0
      },
      maintenance: {
        type: Number,
        default: 0
      }
    }
  }],
  metrics: {
    totalDistance: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    carbonFootprint: {
      total: {
        type: Number,
        default: 0 // kg CO2
      },
      byMode: {
        walking: { type: Number, default: 0 },
        cycling: { type: Number, default: 0 },
        public_transit: { type: Number, default: 0 },
        carpool: { type: Number, default: 0 },
        personal_vehicle: { type: Number, default: 0 },
        electric_vehicle: { type: Number, default: 0 },
        hybrid_vehicle: { type: Number, default: 0 },
        motorcycle: { type: Number, default: 0 },
        other: { type: Number, default: 0 }
      }
    },
    efficiency: {
      avgMPG: {
        type: Number,
        default: 0
      },
      costPerMile: {
        type: Number,
        default: 0
      },
      co2PerMile: {
        type: Number,
        default: 0
      }
    }
  },
  sustainability: {
    ecoFriendlyMiles: {
      type: Number,
      default: 0 // walking, cycling, electric, public transit
    },
    ecoFriendlyPercentage: {
      type: Number,
      default: 0
    },
    carbonSaved: {
      type: Number,
      default: 0 // compared to average single-occupancy vehicle
    },
    goals: {
      targetReduction: {
        type: Number, // percentage reduction in emissions
        default: 0
      },
      targetEcoPercentage: {
        type: Number, // percentage of trips using eco-friendly transport
        default: 50
      },
      targetDate: Date
    }
  },
  incentives: [{
    type: {
      type: String,
      enum: ['discount', 'points', 'recognition', 'parking']
    },
    value: Number,
    description: String,
    earnedDate: {
      type: Date,
      default: Date.now
    },
    redeemed: {
      type: Boolean,
      default: false
    }
  }],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
mobilityDataSchema.index({ user: 1, 'period.startDate': -1 });
mobilityDataSchema.index({ 'period.type': 1, 'period.startDate': -1 });

// Carbon footprint factors (kg CO2 per mile)
const CARBON_FACTORS = {
  walking: 0,
  cycling: 0,
  public_transit: 0.33,
  carpool: 0.24, // assuming 2+ passengers
  personal_vehicle: 0.89, // average US vehicle
  electric_vehicle: 0.28, // varies by electricity source
  hybrid_vehicle: 0.52,
  motorcycle: 0.66,
  other: 0.89
};

// Pre-save middleware to calculate metrics
mobilityDataSchema.pre('save', function(next) {
  let totalDistance = 0;
  let totalCost = 0;
  let totalCarbon = 0;
  let ecoFriendlyMiles = 0;
  const carbonByMode = {};

  // Initialize carbon by mode
  Object.keys(CARBON_FACTORS).forEach(mode => {
    carbonByMode[mode] = 0;
  });

  // Calculate metrics from transportation data
  this.transportation.forEach(trip => {
    const tripDistance = trip.distance * trip.frequency;
    const tripCarbon = tripDistance * (CARBON_FACTORS[trip.mode] || 0.89) / (trip.passengers || 1);
    const tripCost = Object.values(trip.cost).reduce((sum, cost) => sum + (cost || 0), 0);

    totalDistance += tripDistance;
    totalCost += tripCost;
    totalCarbon += tripCarbon;
    
    carbonByMode[trip.mode] = (carbonByMode[trip.mode] || 0) + tripCarbon;

    // Count eco-friendly miles
    if (['walking', 'cycling', 'public_transit', 'electric_vehicle'].includes(trip.mode)) {
      ecoFriendlyMiles += tripDistance;
    }
  });

  // Update metrics
  this.metrics.totalDistance = totalDistance;
  this.metrics.totalCost = totalCost;
  this.metrics.carbonFootprint.total = totalCarbon;
  this.metrics.carbonFootprint.byMode = carbonByMode;

  if (totalDistance > 0) {
    this.metrics.efficiency.costPerMile = totalCost / totalDistance;
    this.metrics.efficiency.co2PerMile = totalCarbon / totalDistance;
    this.sustainability.ecoFriendlyPercentage = (ecoFriendlyMiles / totalDistance) * 100;
  }

  this.sustainability.ecoFriendlyMiles = ecoFriendlyMiles;
  
  // Calculate carbon saved compared to driving alone
  const baselineCarbon = totalDistance * CARBON_FACTORS.personal_vehicle;
  this.sustainability.carbonSaved = Math.max(0, baselineCarbon - totalCarbon);

  next();
});

// Static methods for aggregation
mobilityDataSchema.statics.getCampusEmissions = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        totalEmissions: { $sum: '$metrics.carbonFootprint.total' },
        totalDistance: { $sum: '$metrics.totalDistance' },
        totalCost: { $sum: '$metrics.totalCost' },
        totalCarbonSaved: { $sum: '$sustainability.carbonSaved' },
        avgEcoPercentage: { $avg: '$sustainability.ecoFriendlyPercentage' },
        count: { $sum: 1 }
      }
    }
  ]);
};

mobilityDataSchema.statics.getEmissionsByMode = function(filters = {}) {
  return this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        walking: { $sum: '$metrics.carbonFootprint.byMode.walking' },
        cycling: { $sum: '$metrics.carbonFootprint.byMode.cycling' },
        public_transit: { $sum: '$metrics.carbonFootprint.byMode.public_transit' },
        carpool: { $sum: '$metrics.carbonFootprint.byMode.carpool' },
        personal_vehicle: { $sum: '$metrics.carbonFootprint.byMode.personal_vehicle' },
        electric_vehicle: { $sum: '$metrics.carbonFootprint.byMode.electric_vehicle' },
        hybrid_vehicle: { $sum: '$metrics.carbonFootprint.byMode.hybrid_vehicle' },
        motorcycle: { $sum: '$metrics.carbonFootprint.byMode.motorcycle' },
        other: { $sum: '$metrics.carbonFootprint.byMode.other' }
      }
    }
  ]);
};

mobilityDataSchema.statics.getUserTrends = function(userId, period = 'monthly') {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), 'period.type': period } },
    { $sort: { 'period.startDate': 1 } },
    {
      $project: {
        date: '$period.startDate',
        totalEmissions: '$metrics.carbonFootprint.total',
        totalDistance: '$metrics.totalDistance',
        ecoPercentage: '$sustainability.ecoFriendlyPercentage',
        carbonSaved: '$sustainability.carbonSaved',
        totalCost: '$metrics.totalCost'
      }
    }
  ]);
};

module.exports = mongoose.model('MobilityData', mobilityDataSchema);