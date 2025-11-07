//How to link to mongodb lab06
//Link to ejs lab07


// Load required modules
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
const uri = 'mongodb+srv://alanluk:projectTesting@cluster0.km9rij5.mongodb.net/fitness_user?retryWrites=true&w=majority';
const PORT = 8099; 

// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
    }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password, email} = req.body;

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
            email,
            fitnessGoals: fitnessGoals || {}
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                
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

// Get all users route (for testing)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords
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

// Connect to MongoDB
async function connectToDatabase() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB Atlas successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1); // Exit if cannot connect to database
    }
}

// Set view engine
app.set('view engine', 'ejs');

// Routes(total 7)
//link to index page
app.get("/", (req, res) => {
    res.status(200).render('index', { title: "Home page" });
});
//link to create page
app.get("/", (req, res) => {
    res.status(200).render('create', { title: "Create page" });
});
//link to read page
app.get("/", (req, res) => {
    res.status(200).render('read', { title: "Read page" });
//link to update page
app.get("/", (req, res) => {
    res.status(200).render('update', { title: "Update page" });
//link to delete page
app.get("/", (req, res) => {
    res.status(200).render('delete', { title: "Delete page" });
//link to login page
app.get("/", (req, res) => {
    res.status(200).render('login', { title: "Login age" });
//link to register page
app.get("/", (req, res) => {
    res.status(200).render('register', { title: "Register page" }); 

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Fitness Workout Tracker API is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    await connectToDatabase();
});
