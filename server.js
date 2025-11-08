const mongoose = require('mongoose'); // ODM -- MongoDB && Node.js
const bcrypt = require('bcryptjs'); // hashing && verifying pwd
const cors = require('cors'); // enable communication between frontend && backend
const express = require('express'); //
const session = require('express-session'); // Middleware for managing session in Express

const app = express();

// Import User model
import User from "./models/User.js";
import Workout from "./models/Workout.js";


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended : true}));

// Session middleware (required for authentication)
app.use(session({
    secret: 'your-secret-key', // Change this to a random string
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// MongoDB connection
const url = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';
const PORT = 8099;

// Set view engine
app.set('view engine', 'ejs');

// Simple authentication middleware (optional)
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
// Link to index page
app.get("/", (req, res) => {
    res.status(200).render('index', { 
        title: "Home page",
        user: req.session.user || null 
    });
});

// Link to create page (protected example)
app.get("/create", requireAuth, (req, res) => {
    res.status(200).render('create', { 
        title: "Create page",
        user: req.session.user 
    });
});

// Link to read page
app.get("/read", (req, res) => {
    res.status(200).render('read', { 
        title: "Read page",
        user: req.session.user || null 
    });
});

// Link to update page
app.get("/update", (req, res) => {
    res.status(200).render('update', { 
        title: "Update page",
        user: req.session.user || null 
    });
});

// Link to delete page
app.get("/delete", (req, res) => {
    res.status(200).render('delete', { 
        title: "Delete page",
        user: req.session.user || null 
    });
});

// Link to login page
app.get("/login", (req, res) => {
    // If already logged in, redirect to home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('login', { title: "Login page" });
});

// Link to register page
app.get("/register", (req, res) => {
    // If already logged in, redirect to home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.status(200).render('register', { title: "Register page" });
});

// Logout route with express-session to track logged-in users
/* Method1
app.get("/logout", (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Logout failed' 
            });
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        // Redirect to home page or login page
        res.redirect('/');
    });
});
*/

// Simple logout without sessions
//Method2
app.get("/logout", (req, res) => {
    res.redirect('/login?message=Logged out successfully');
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

        // Automatically log in user after signup (optional)
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

// Login Route - UPDATED with session
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

// Create (CRUD) workout
app.post('/api/workouts', requireAuth, async (req, res) => {
    // Validate input
    if (!req.body.title) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title is required' 
            });
        }
    try {
        const workout = new Workout({
            ...req.body, 
            user: req.session.user.id 
        });
        await workout.save();
        res.status(201).json({ 
            success: true,
            workout 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Read (CRUD) workout --- for the logged-in user to find out all the workout schedule 
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
        res.status(500).json({ 
            success: false, 
            error: "server error"
        });
    }
});

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri); // ✅ Simplified - removes warnings
        console.log('✅ Connected to MongoDB Atlas successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    await connectToDatabase();
});
