const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Exercise Type Information
    exerciseType: {
        type: String,
        required: true,
        enum: [
            'cardio', 'strength', 'flexibility', 'balance', 
            'high-intensity-interval-training', 'sports', 'other'
        ]
    },
    exerciseName: {
        type: String,
        required: true,
        trim: true
    },
    
    // Timing Information
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        min: 1
    },
    
    // Calories and Intensity
    caloriesBurned: {
        type: Number,
        required: true,
        min: 0
    },
    intensity: {
        type: String,
        enum: ['light', 'moderate', 'vigorous'],
        default: 'moderate'
    },
    metabolicEquivalent: {
        type: Number, // MET value for more accurate calorie calculation
        min: 0
    },
    
    // Exercise Specific Details
    sets: {
        type: Number,
        min: 0
    },
    reps: {
        type: Number,
        min: 0
    },
    weight: {
        type: Number, // in kg or lbs
        min: 0
    },
    distance: {
        type: Number, // in km or miles
        min: 0
    },
    distanceUnit: {
        type: String,
        enum: ['km', 'miles', 'meters', 'yards'],
        default: 'km'
    },
    
    // Cardio Specific
    averageHeartRate: {
        type: Number,
        min: 0
    },
    maxHeartRate: {
        type: Number,
        min: 0
    },
    
    // Strength Training Specific
    muscleGroups: [{
        type: String,
        enum: [
            'chest', 'back', 'shoulders', 'biceps', 'triceps',
            'quadriceps', 'hamstrings', 'glutes', 'calves',
            'abdominals', 'obliques', 'full-body', 'upper-body', 'lower-body'
        ]
    }],
    
    // Additional Metrics
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    perceivedExertion: {
        type: Number,
        min: 1,
        max: 10
    },
    
    // Workout Status
    status: {
        type: String,
        enum: ['completed', 'in-progress', 'planned', 'cancelled'],
        default: 'completed'
    },
    
    // Equipment Used
    equipment: [{
        type: String,
        enum: [
            'barbell', 'dumbbell', 'kettlebell', 'resistance-band',
            'yoga-mat', 'treadmill', 'stationary-bike', 'elliptical',
            'rower', 'pull-up-bar', 'weight-machine', 'bodyweight', 'other'
        ]
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Virtual for calculating duration automatically
workoutSchema.virtual('calculatedDuration').get(function() {
    if (this.startTime && this.endTime) {
        return (this.endTime - this.startTime) / (1000 * 60); // Convert ms to minutes
    }
    return this.duration;
});

// Pre-save middleware to calculate duration if not provided
workoutSchema.pre('save', function(next) {
    if (this.startTime && this.endTime && !this.duration) {
        this.duration = (this.endTime - this.startTime) / (1000 * 60);
    }
    
    // Ensure endTime is after startTime
    if (this.startTime && this.endTime && this.endTime <= this.startTime) {
        return next(new Error('End time must be after start time'));
    }
    
    next();
});

// Static method to get workouts by date range
workoutSchema.statics.findByDateRange = function(userId, startDate, endDate) {
    return this.find({
        user: userId,
        date: {
            $gte: startDate,
            $lte: endDate
        }
    }).sort({ date: 1, startTime: 1 });
};

// Static method to get total calories burned in a period
workoutSchema.statics.getTotalCalories = function(userId, startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                totalCalories: { $sum: '$caloriesBurned' },
                totalWorkouts: { $sum: 1 },
                totalDuration: { $sum: '$duration' }
            }
        }
    ]);
};

// Instance method to get workout summary
workoutSchema.methods.getSummary = function() {
    return {
        exercise: this.exerciseName,
        type: this.exerciseType,
        duration: this.duration,
        calories: this.caloriesBurned,
        intensity: this.intensity,
        date: this.date.toLocaleDateString()
    };
};

// Index for better query performance
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, exerciseType: 1 });
workoutSchema.index({ user: 1, caloriesBurned: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
