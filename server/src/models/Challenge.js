const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['individual', 'department', 'campus_wide'],
    required: true
  },
  category: {
    type: String,
    enum: ['energy', 'water', 'waste', 'mobility', 'general'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  duration: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    durationDays: {
      type: Number,
      required: true
    }
  },
  goals: {
    target: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true // e.g., 'kWh', 'gallons', 'lbs', 'miles', 'points'
    },
    metric: {
      type: String,
      required: true // e.g., 'reduction', 'total', 'percentage'
    }
  },
  rewards: {
    points: {
      type: Number,
      required: true,
      min: 0
    },
    badge: {
      name: String,
      description: String,
      imageUrl: String
    },
    prizes: [{
      name: String,
      description: String,
      value: Number,
      quantity: {
        type: Number,
        default: 1
      }
    }]
  },
  rules: [{
    type: String,
    description: String
  }],
  eligibility: {
    roles: [{
      type: String,
      enum: ['admin', 'faculty', 'student']
    }],
    departments: [String],
    minLevel: {
      type: Number,
      default: 1
    }
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      current: {
        type: Number,
        default: 0
      },
      percentage: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    rank: Number
  }],
  leaderboard: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    rank: Number,
    department: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  metrics: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0
    },
    impact: {
      totalSavings: Number,
      co2Reduced: Number,
      costSavings: Number
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'annually']
    },
    nextOccurrence: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
challengeSchema.index({ status: 1, 'duration.startDate': -1 });
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ 'participants.user': 1 });
challengeSchema.index({ featured: 1, status: 1 });

// Pre-save middleware to calculate metrics
challengeSchema.pre('save', function(next) {
  if (this.participants && this.participants.length > 0) {
    this.metrics.totalParticipants = this.participants.length;
    
    const completed = this.participants.filter(p => p.completed).length;
    this.metrics.completionRate = (completed / this.participants.length) * 100;
    
    const totalProgress = this.participants.reduce((sum, p) => sum + p.progress.percentage, 0);
    this.metrics.averageProgress = totalProgress / this.participants.length;
    
    // Update leaderboard
    this.leaderboard = this.participants
      .map(p => ({
        user: p.user,
        score: p.progress.current,
        rank: 0,
        department: null // Will be populated with user data
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }
  
  next();
});

// Methods
challengeSchema.methods.addParticipant = function(userId) {
  const existingParticipant = this.participants.find(p => p.user.toString() === userId.toString());
  if (!existingParticipant) {
    this.participants.push({ user: userId });
    return this.save();
  }
  return Promise.resolve(this);
};

challengeSchema.methods.updateProgress = function(userId, newProgress) {
  const participant = this.participants.find(p => p.user.toString() === userId.toString());
  if (participant) {
    participant.progress.current = newProgress;
    participant.progress.percentage = Math.min((newProgress / this.goals.target) * 100, 100);
    participant.progress.lastUpdated = new Date();
    
    if (participant.progress.percentage >= 100 && !participant.completed) {
      participant.completed = true;
      participant.completedAt = new Date();
    }
    
    return this.save();
  }
  return Promise.reject(new Error('Participant not found'));
};

// Static methods
challengeSchema.statics.getActiveByCategory = function(category) {
  return this.find({
    status: 'active',
    category: category,
    'duration.startDate': { $lte: new Date() },
    'duration.endDate': { $gte: new Date() }
  }).populate('createdBy', 'displayName department');
};

challengeSchema.statics.getUserChallenges = function(userId, status = null) {
  const query = { 'participants.user': userId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('createdBy', 'displayName department')
    .sort({ 'duration.startDate': -1 });
};

module.exports = mongoose.model('Challenge', challengeSchema);