const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        unique: true,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    studentName: String,
    rollNumber: String,
    category: {
        type: String,
        required: true,
        enum: ['Hostel Maintenance', 'Academics', 'Library', 'Canteen', 'Sports Facilities', 'Infrastructure', 'Administration', 'Other']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    building: {
        type: String,
        required: true
    },
    floor: {
        type: String,
        required: true
    },
    specificLocation: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: String,
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    assignedTo: String,
    staffNotes: String,
    resolution: String,
    rating: {
        score: Number,
        comment: String,
        ratedAt: Date
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Complaint', complaintSchema);