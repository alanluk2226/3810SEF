// server.js - Fixed for Render deployment
console.log('🚀 Starting Fitness Tracker Server...');

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config();

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// MongoDB connection - use environment variable
const uri = process.env.MONGODB_URI || 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_workout_tracker?retryWrites=true&w=majority';
const PORT = process.env.PORT || 8099;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import models
import User from './models/User.js';
import Workout from './models/Workout.js';

console.log('✅ Models imported successfully');

// Simple authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get("/", requireAuth, async (req, res) => {
    try {
        // Get dashboard data
        const [workouts, stats, recentWorkouts] = await Promise.all([
            Workout.find({ user: req.session.user.id }),
            Workout.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(req.session.user.id) } },
                {
                    $group: {
                        _id: null,
                        totalWorkouts: { $sum: 1 },
                        totalCalories: { $sum: "$caloriesBurned" },
                        totalDuration: { $sum: "$duration" },
                        avgDuration: { $avg: "$duration" },
                        avgCalories: { $avg: "$caloriesBurned" }
                    }
                }
            ]),
            Workout.find({ user: req.session.user.id })
                .sort({ date: -1 })
                .limit(3)
        ]);

        const workoutStats = stats.length > 0 ? stats[0] : {
            totalWorkouts: 0,
            totalCalories: 0,
            totalDuration: 0,
            avgDuration: 0,
            avgCalories: 0
        };

        // Calculate current streak (simplified version)
        let currentStreak = 1;
        if (recentWorkouts.length > 0) {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Simple streak logic - check if user worked out today or yesterday
            const hasRecentWorkout = recentWorkouts.some(workout => {
                const workoutDate = new Date(workout.date);
                return workoutDate.toDateString() === today.toDateString() || 
                       workoutDate.toDateString() === yesterday.toDateString();
            });
            currentStreak = hasRecentWorkout ? 2 : 1;
        }

        res.status(200).render('index', { 
            title: "Home page",
            user: req.session.user,
            totalWorkouts: workoutStats.totalWorkouts,
            totalCalories: workoutStats.totalCalories || 0,
            totalDuration: workoutStats.totalDuration || 0,
            currentStreak: currentStreak,
            recentWorkouts: recentWorkouts,
            workoutStats: workoutStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(200).render('index', { 
            title: "Home page",
            user: req.session.user,
            totalWorkouts: 0,
            totalCalories: 0,
            totalDuration: 0,
            currentStreak: 1,
            recentWorkouts: [],
            error: "Error loading dashboard data"
        });
    }
});

app.get("/create", requireAuth, (req, res) => {
    res.status(200).render('create', { 
        title: "Create page",
        user: req.session.user 
    });
});

app.get("/read", requireAuth, (req, res) => {
    res.status(200).render('read', { 
        title: "Read page",
        user: req.session.user 
    });
});

// Update workout page - handles both with and without ID
app.get("/update", requireAuth, async (req, res) => {
    try {
        const workoutId = req.query.id;
        
        // If no ID provided, show workout selection within the same page
        if (!workoutId) {
            const workouts = await Workout.find({ 
                user: req.session.user.id 
            }).sort({ date: -1 });
            
            return res.status(200).render('update', { 
                title: "Update Workout - Select",
                user: req.session.user,
                workouts: workouts, // Pass workouts for selection
                workout: null, // No specific workout to edit
                error: null,
                mode: 'select' // Indicate we're in selection mode
            });
        }
        
        // If ID provided, show the update form with workout data
        const workout = await Workout.findOne({ 
            _id: workoutId, 
            user: req.session.user.id 
        });
        
        if (!workout) {
            return res.status(404).render('update', { 
                title: "Update Workout",
                user: req.session.user,
                workouts: [],
                workout: null,
                error: 'Workout not found',
                mode: 'error'
            });
        }
        
        res.status(200).render('update', { 
            title: "Update Workout",
            user: req.session.user,
            workouts: [],
            workout: workout,
            error: null,
            mode: 'edit' // Indicate we're in edit mode
        });
        
    } catch (error) {
        console.error('Error loading update page:', error);
        res.status(500).render('update', { 
            title: "Update Workout",
            user: req.session.user,
            workouts: [],
            workout: null,
            error: 'Error loading workout',
            mode: 'error'
        });
    }
});

app.get("/delete", requireAuth, (req, res) => {
    res.status(200).render('delete', { 
        title: "Delete page",
        user: req.session.user 
    });
});

app.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('login', { title: "Login page" });
});

app.get("/register", (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('register', { title: "Register page" });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email
        });

        // Save user to database
        await newUser.save();

        // Automatically log in user after signup
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                joinDate: newUser.joinDate
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during signup'
        });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        // Create session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                joinDate: user.joinDate
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
});

// Get current user route
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({
            success: true,
            user: req.session.user
        });
    } else {
        res.json({
            success: false,
            message: 'No user logged in'
        });
    }
});

// Get all users route (for testing)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json({
            success: true,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Fitness Workout Tracker API is running!',
        timestamp: new Date().toISOString()
    });
});

// NEW: Get Recent Activity (Last 5 Workouts)
app.get('/api/workouts/recent', requireAuth, async (req, res) => {
    try {
        const recentWorkouts = await Workout.find({ 
            user: req.session.user.id 
        })
        .sort({ date: -1 })
        .limit(5)
        .select('exerciseName duration caloriesBurned exerciseType date intensity notes');
        
        res.json({ 
            success: true, 
            recentWorkouts 
        });
    } catch (error) {
        console.error('Get recent workouts error:', error);
        res.status(500).json({ 
            success: false, 
            error: "Server error" 
        });
    }
});

// NEW: Get Workout Statistics
app.get('/api/workouts/stats', requireAuth, async (req, res) => {
    try {
        const stats = await Workout.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.session.user.id) } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalCalories: { $sum: "$caloriesBurned" },
                    totalDuration: { $sum: "$duration" },
                    avgDuration: { $avg: "$duration" },
                    avgCalories: { $avg: "$caloriesBurned" },
                    mostCommonType: { 
                        $first: "$exerciseType"
                    }
                }
            }
        ]);
        
        const defaultStats = {
            totalWorkouts: 0,
            totalCalories: 0,
            totalDuration: 0,
            avgDuration: 0,
            avgCalories: 0,
            mostCommonType: "cardio"
        };
        
        res.json({ 
            success: true, 
            stats: stats.length > 0 ? stats[0] : defaultStats 
        });
    } catch (error) {
        console.error('Get workout stats error:', error);
        res.status(500).json({ 
            success: false, 
            error: "Server error" 
        });
    }
});

// NEW: Get Workout Suggestions
app.get('/api/workouts/suggestions', requireAuth, async (req, res) => {
    try {
        const suggestions = [
            {
                category: "Cardio Training",
                description: "Running, Cycling, Swimming",
                benefits: "Burn calories and improve endurance",
                type: "cardio",
                recommendedDuration: 30
            },
            {
                category: "Strength Training", 
                description: "Weight Lifting, Bodyweight Exercises",
                benefits: "Build muscle and strength",
                type: "strength",
                recommendedDuration: 45
            },
            {
                category: "Flexibility",
                description: "Yoga, Stretching, Mobility",
                benefits: "Improve flexibility and recovery", 
                type: "flexibility",
                recommendedDuration: 20
            },
            {
                category: "High Intensity Interval Training",
                description: "HIIT, Circuit Training",
                benefits: "Maximize calorie burn in less time",
                type: "hiit",
                recommendedDuration: 25
            }
        ];
        
        res.json({ 
            success: true, 
            suggestions 
        });
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({ 
            success: false, 
            error: "Server error" 
        });
    }
});

// Create (CRUD) workout
app.post('/api/workouts', requireAuth, async (req, res) => {
    try {
        const {
            exerciseType,
            exerciseName,
            date,
            startTime,
            endTime,
            duration,
            caloriesBurned,
            intensity,
            sets,
            reps,
            weight,
            distance,
            distanceUnit,
            notes
        } = req.body;

        // 驗證必需字段
        if (!exerciseType || !exerciseName || !date || !duration || !caloriesBurned) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: exerciseType, exerciseName, date, duration, caloriesBurned"
            });
        }

        // 創建 workout 對象
        const workoutData = {
            user: req.session.user.id,
            exerciseType,
            exerciseName,
            date: new Date(date),
            startTime: startTime ? new Date(`${date}T${startTime}`) : new Date(),
            endTime: endTime ? new Date(`${date}T${endTime}`) : new Date(new Date().getTime() + duration * 60000),
            duration: parseInt(duration),
            caloriesBurned: parseInt(caloriesBurned),
            intensity: intensity || 'moderate',
            status: 'completed'
        };

        // 可選字段
        if (sets) workoutData.sets = parseInt(sets);
        if (reps) workoutData.reps = parseInt(reps);
        if (weight) workoutData.weight = parseFloat(weight);
        if (distance) workoutData.distance = parseFloat(distance);
        if (distanceUnit) workoutData.distanceUnit = distanceUnit;
        if (notes) workoutData.notes = notes;

        const workout = new Workout(workoutData);
        await workout.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Workout created successfully!',
            workout 
        });
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || "server error"
        });
    }
});

// Read (CRUD) workout
app.get('/api/workouts', requireAuth, async (req, res) => {
    try {
        const workouts = await Workout.find({ 
            user: req.session.user.id 
        });
        res.json({ 
            success: true, 
            workouts 
        });
    } catch (error) {
        console.error('Read workouts error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Read One (CRUD) workout
app.get('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        const workout = await Workout.findOne({ 
            _id: req.params.id, 
            user: req.session.user.id 
        });
        if (!workout) return res.status(404).json({ 
            success: false, 
            error: 'Workout schedule not found' 
        });
        res.json({ 
            success: true, 
            workout 
        });
    } catch (error) {
        console.error('Read workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Update (CRUD) workout
app.put('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate({ 
            _id: req.params.id, 
            user: req.session.user.id },
            req.body,
            { new: true }
        );
        if (!workout) return res.status(404).json({ 
            success: false, 
            error: 'Workout schedule not found' 
        });
        res.json({ 
            success: true, 
            workout 
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Delete (CRUD) workout
app.delete('/api/workouts/:id', requireAuth, async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.session.user.id 
        });
        if (!workout) return res.status(404).json({ 
            success: false, 
            error: 'Workout schedule not found' 
        });
        res.json({ 
            success: true, 
            message: 'Workout schedule deleted' 
        });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB Atlas successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found',
        user: req.session.user 
    });
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    await connectToDatabase();
});
