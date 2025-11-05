const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Masked debug: log whether the MONGODB_URI env var is present (do NOT print its value)
        console.log('Attempting to connect to MongoDB...');
        console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.log('Server will continue without database connection...');
        // Don't exit - allow server to run without DB
    }
};

module.exports = connectDB;