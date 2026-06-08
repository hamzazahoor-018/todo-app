require('dotenv').config();

const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const testRoutes = require('./routes/test');
const submissionRoutes = require('./routes/submission');
const authMiddleware = require('./middlewares/authMiddleware');
const { initSocket } = require('./socket');

const app = express();
const port = process.env.PORT || 3000;

// setting up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

app.use(cors({
    origin: frontendOrigin,
    credentials: true
}));
app.use(express.json());
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
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/hello', (req, res) => {
    var data = req.query;
    res.send('Hello ' + data.name);
});

// Auth Routes (signup, login, logout, refresh-token)
app.use('/auth', authRoutes);

// Protected Todo Routes
app.use('/todo', authMiddleware, todoRoutes);

// Protected Test Routes
app.use('/tests', authMiddleware, testRoutes);
app.use('/submissions', authMiddleware, submissionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});


const server = http.createServer(app);
initSocket(server, frontendOrigin);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


