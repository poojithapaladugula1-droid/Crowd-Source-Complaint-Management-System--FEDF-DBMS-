const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Student Login
exports.studentLogin = async (req, res) => {
    try {
        const { studentId, password } = req.body;

        // Validate student ID format
        if (!/^2[0-9]{9}$/.test(studentId)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit Student ID starting with 2'
            });
        }

        // Check if user exists
        const user = await User.findOne({ 
            identifier: studentId, 
            userType: 'student' 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Student ID or password'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Student ID or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                identifier: user.identifier,
                userType: user.userType,
                name: user.name,
                rollNumber: user.rollNumber
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Staff Login
exports.staffLogin = async (req, res) => {
    try {
        const { email, password, department } = req.body;

        // Check if user exists
        const user = await User.findOne({ 
            email: email, 
            userType: 'staff' 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check department
        if (user.department !== department) {
            return res.status(401).json({
                success: false,
                message: 'Invalid department selection'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                identifier: user.identifier,
                userType: user.userType,
                email: user.email,
                department: user.department
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Register Student (for testing)
exports.registerStudent = async (req, res) => {
    try {
        const { studentId, password, name, rollNumber, phone } = req.body;

        const user = await User.create({
            identifier: studentId,
            password,
            userType: 'student',
            name,
            rollNumber,
            phone
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                identifier: user.identifier,
                userType: user.userType,
                name: user.name,
                rollNumber: user.rollNumber
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Student ID already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// Register Staff (for testing)
exports.registerStaff = async (req, res) => {
    try {
        const { email, password, name, department, phone } = req.body;

        const user = await User.create({
            identifier: email,
            password,
            userType: 'staff',
            name,
            email,
            department,
            phone
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                identifier: user.identifier,
                userType: user.userType,
                email: user.email,
                department: user.department,
                name: user.name
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};