const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to database (non-blocking)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files from project root (so index.html is served)
app.use(express.static(path.join(__dirname)));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/users', require('./routes/users'));

// Health-check
app.get('/health', (req, res) => {
    res.json({ healthy: true, timestamp: Date.now() });
});

// Home route - serve frontend index.html if present, otherwise fallback to JSON
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    try {
        return res.sendFile(indexPath);
    } catch (err) {
        return res.json({ 
            message: 'KLHResolve Backend API',
            version: '1.0.0'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// SPA-friendly catch-all: if the route looks like an API route, return 404 JSON,
// otherwise return index.html so client-side routing works when hosted as a single-page app.
// Fallback handler for non-API routes: serve the SPA index.html
app.use((req, res) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
        return res.status(404).json({ success: false, message: 'Route not found' });
    }

    const indexPath = path.join(__dirname, 'index.html');
    return res.sendFile(indexPath);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});