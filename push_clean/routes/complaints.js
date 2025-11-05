const express = require('express');
const {
    submitComplaint,
    getStudentComplaints,
    getStaffComplaints,
    updateComplaint,
    getComplaintDetails,
    submitRating
} = require('../controllers/complaintController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Student routes
router.post('/submit', auth, authorize('student'), upload.single('photo'), submitComplaint);
router.get('/student', auth, authorize('student'), getStudentComplaints);

// Staff routes
router.get('/staff', auth, authorize('staff'), getStaffComplaints);
router.put('/:id', auth, authorize('staff'), updateComplaint);

// Common routes
router.get('/:id', auth, getComplaintDetails);
router.post('/:id/rate', auth, authorize('student'), submitRating);

module.exports = router;