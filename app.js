require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const todoController = require('./controllers/todoController');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const Todo = require('./models/Todo');

const app = express();
const port = process.env.PORT || 3000;

// setting up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple request logger for debugging routes
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.path);
    next();
});


// middleware to serve static files
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes

// Public Routes
app.get("/", (req, res) => {
    res.send("Welcome to the Auth API with JWT");
});

app.get('/hello', (req, res) => {
    var data = req.query;
    res.send('Hello ' + data.name);
});

// Auth Routes (signup, login, logout, refresh-token)
app.use('/auth', authRoutes);

// Log registered routes (for debugging)
function listRoutes() {
    const routes = [];
    if (!app._router || !app._router.stack) {
        console.log('No routes registered yet');
        return;
    }
    
    app._router.stack.forEach(mw => {
        if (mw.route) {
            // Direct route on app
            const methods = Object.keys(mw.route.methods).join(',').toUpperCase();
            routes.push(`${methods} ${mw.route.path}`);
        } else if (mw.name === 'router' && mw.handle && mw.handle.stack) {
            // Nested router
            mw.handle.stack.forEach(r => {
                if (r.route && r.route.path) {
                    const methods = Object.keys(r.route.methods).join(',').toUpperCase();
                    // Extract parent path from regexp
                    let parent = '';
                    if (mw.regexp) {
                        const source = mw.regexp.source;
                        const match = source.match(/^\\\/([a-z-]*)/);
                        if (match) parent = '/' + match[1];
                    }
                    routes.push(`${methods} ${parent}${r.route.path}`);
                }
            });
        }
    });
    
    if (routes.length > 0) {
        console.log('Registered routes:\n' + routes.join('\n'));
    } else {
        console.log('No routes found in stack');
    }
}

// Protected Routes (require JWT)
app.use('/api', authMiddleware);

// Protected Todo Routes
todoController(app, Todo);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Print routes then start the server
listRoutes();
// start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



