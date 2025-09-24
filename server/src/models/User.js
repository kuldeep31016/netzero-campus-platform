const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    default: 'student'
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  sustainabilityProfile: {
    totalPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      name: String,
      description: String,
      imageUrl: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: [{
      title: String,
      description: String,
      points: Number,
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    goals: [{
      type: {
        type: String,
        enum: ['energy', 'water', 'waste', 'mobility']
      },
      target: Number,
      current: {
        type: Number,
        default: 0
      },
      deadline: Date,
      status: {
        type: String,
        enum: ['active', 'completed', 'expired'],
        default: 'active'
      }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ department: 1, role: 1 });
userSchema.index({ 'sustainabilityProfile.totalPoints': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's rank
userSchema.virtual('rank').get(async function() {
  const higherRanked = await this.constructor.countDocuments({
    'sustainabilityProfile.totalPoints': { $gt: this.sustainabilityProfile.totalPoints }
  });
  return higherRanked + 1;
});

// Method to add points
userSchema.methods.addPoints = function(points, reason) {
  this.sustainabilityProfile.totalPoints += points;
  
  // Calculate new level (every 100 points = 1 level)
  this.sustainabilityProfile.level = Math.floor(this.sustainabilityProfile.totalPoints / 100) + 1;
  
  // Add achievement record
  this.sustainabilityProfile.achievements.push({
    title: reason,
    description: `Earned ${points} points for ${reason}`,
    points: points
  });
  
  return this.save();
};

// Method to award badge
userSchema.methods.awardBadge = function(badge) {
  const existingBadge = this.sustainabilityProfile.badges.find(b => b.name === badge.name);
  if (!existingBadge) {
    this.sustainabilityProfile.badges.push(badge);
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('User', userSchema);