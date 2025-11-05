const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['student', 'staff'],
        required: true
    },
    name: {
        type: String,
        required: function() {
            return this.userType === 'student';
        }
    },
    email: {
        type: String,
        required: function() {
            return this.userType === 'staff';
        }
    },
    department: {
        type: String,
        required: function() {
            return this.userType === 'staff';
        }
    },
    rollNumber: {
        type: String,
        required: function() {
            return this.userType === 'student';
        }
    },
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);