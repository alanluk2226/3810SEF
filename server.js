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
app.use(express.urlencoded({ extended: true })); // Added for form data

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
});

// Create User model
const User = mongoose.model('User', userSchema);

// Set view engine
app.set('view engine', 'ejs');

// Routes (total 7)
// Link to index page
app.get("/", (req, res) => {
    res.status(200).render('index', { title: "Home page" });
});

// Link to create page
app.get("/create", (req, res) => {
    res.status(200).render('create', { title: "Create page" });
});

// Link to read page
app.get("/read", (req, res) => {
    res.status(200).render('read', { title: "Read page" });
});

// Link to update page
app.get("/update", (req, res) => {
    res.status(200).render('update', { title: "Update page" });
});

// Link to delete page
app.get("/delete", (req, res) => {
    res.status(200).render('delete', { title: "Delete page" });
});

// Link to login page
app.get("/login", (req, res) => {
    res.status(200).render('login', { title: "Login page" });
});

// Link to register page
app.get("/register", (req, res) => {
    res.status(200).render('register', { title: "Register page" });
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

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
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

// Login Route (you'll need to implement this)
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
        
        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
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

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Fitness Workout Tracker API is running!',
        timestamp: new Date().toISOString()
    });
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

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    await connectToDatabase();
});
