import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseType: {
        type: String,
        required: true,
        enum: ['cardio', 'strength', 'flexibility', 'balance', 'high-intensity-interval-training', 'sports', 'other']
    },
    exerciseName: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
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
    sets: {
        type: Number,
        min: 0
    },
    reps: {
        type: Number,
        min: 0
    },
    weight: {
        type: Number,
        min: 0
    },
    distance: {
        type: Number,
        min: 0
    },
    distanceUnit: {
        type: String,
        enum: ['km', 'miles', 'meters', 'yards']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['planned', 'in-progress', 'completed', 'cancelled'],
        default: 'completed'
    }
}, {
    timestamps: true
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
