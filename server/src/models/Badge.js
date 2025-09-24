const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['energy', 'water', 'waste', 'mobility', 'general', 'special'],
    required: true
  },
  type: {
    type: String,
    enum: ['achievement', 'milestone', 'participation', 'leadership', 'innovation'],
    default: 'achievement'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  criteria: {
    type: {
      type: String,
      enum: ['points', 'metric', 'participation', 'challenge', 'streak', 'special'],
      required: true
    },
    requirement: {
      value: {
        type: Number,
        required: true
      },
      unit: String,
      comparison: {
        type: String,
        enum: ['greater_than', 'less_than', 'equal_to', 'greater_equal', 'less_equal'],
        default: 'greater_equal'
      }
    },
    conditions: [{
      field: String,
      operator: String,
      value: mongoose.Schema.Types.Mixed
    }]
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    multiplier: {
      type: Number,
      default: 1.0 // Points multiplier for future activities
    },
    privileges: [String] // Special privileges or access
  },
  design: {
    imageUrl: String,
    iconUrl: String,
    color: {
      type: String,
      default: '#3B82F6'
    },
    shape: {
      type: String,
      enum: ['circle', 'shield', 'star', 'hexagon', 'custom'],
      default: 'circle'
    }
  },
  statistics: {
    totalAwarded: {
      type: Number,
      default: 0
    },
    uniqueRecipients: {
      type: Number,
      default: 0
    },
    firstAwarded: Date,
    lastAwarded: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHidden: {
    type: Boolean,
    default: false // Hidden badges are surprise rewards
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String]
}, {
  timestamps: true
});

// User Badge Progress Schema
const userBadgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    required: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['locked', 'in_progress', 'earned'],
    default: 'locked'
  },
  earnedAt: Date,
  displayOrder: {
    type: Number,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  metadata: {
    sourceChallenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    specialConditions: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
badgeSchema.index({ category: 1, rarity: 1 });
badgeSchema.index({ isActive: 1, isHidden: 1 });
badgeSchema.index({ 'statistics.totalAwarded': -1 });

userBadgeSchema.index({ user: 1, status: 1 });
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

// Badge methods
badgeSchema.methods.checkEligibility = function(userData) {
  const { requirement } = this.criteria;
  let userValue;
  
  switch (this.criteria.type) {
    case 'points':
      userValue = userData.sustainabilityProfile.totalPoints;
      break;
    case 'metric':
      // This would depend on the specific metric being tracked
      userValue = userData.metrics ? userData.metrics[requirement.unit] : 0;
      break;
    case 'participation':
      userValue = userData.challengesCompleted || 0;
      break;
    case 'streak':
      userValue = userData.currentStreak || 0;
      break;
    default:
      return false;
  }
  
  switch (requirement.comparison) {
    case 'greater_than':
      return userValue > requirement.value;
    case 'less_than':
      return userValue < requirement.value;
    case 'equal_to':
      return userValue === requirement.value;
    case 'greater_equal':
      return userValue >= requirement.value;
    case 'less_equal':
      return userValue <= requirement.value;
    default:
      return false;
  }
};

badgeSchema.methods.award = function() {
  this.statistics.totalAwarded += 1;
  this.statistics.lastAwarded = new Date();
  
  if (!this.statistics.firstAwarded) {
    this.statistics.firstAwarded = new Date();
  }
  
  return this.save();
};

// Static methods for badges
badgeSchema.statics.getAvailableBadges = function(category = null) {
  const query = { isActive: true, isHidden: false };
  if (category) {
    query.category = category;
  }
  return this.find(query).sort({ rarity: 1, name: 1 });
};

badgeSchema.statics.checkUserBadges = async function(userId, userData) {
  const badges = await this.find({ isActive: true });
  const eligibleBadges = [];
  
  for (const badge of badges) {
    if (badge.checkEligibility(userData)) {
      // Check if user already has this badge
      const existingUserBadge = await UserBadge.findOne({ user: userId, badge: badge._id });
      if (!existingUserBadge || existingUserBadge.status !== 'earned') {
        eligibleBadges.push(badge);
      }
    }
  }
  
  return eligibleBadges;
};

// User Badge methods
userBadgeSchema.methods.updateProgress = function(newProgress) {
  this.progress.current = newProgress;
  this.progress.percentage = Math.min((newProgress / this.progress.required) * 100, 100);
  
  if (this.progress.percentage >= 100 && this.status !== 'earned') {
    this.status = 'earned';
    this.earnedAt = new Date();
  } else if (this.progress.current > 0 && this.status === 'locked') {
    this.status = 'in_progress';
  }
  
  return this.save();
};

const Badge = mongoose.model('Badge', badgeSchema);
const UserBadge = mongoose.model('UserBadge', userBadgeSchema);

module.exports = { Badge, UserBadge };