const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// Submit Complaint
exports.submitComplaint = async (req, res) => {
    try {
        const { 
            studentId, studentName, rollNumber, category, priority, 
            building, floor, specificLocation, title, description 
        } = req.body;

        // Generate complaint ID
        const complaintId = `COMP-${Date.now()}`;

        const complaint = await Complaint.create({
            complaintId,
            studentId,
            studentName,
            rollNumber,
            category,
            priority,
            building,
            floor,
            specificLocation,
            title,
            description,
            photo: req.file ? `/uploads/${req.file.filename}` : null
        });

        // Create notification for relevant staff
        await Notification.create({
            userId: 'staff', // This would be specific staff users in real implementation
            userType: 'staff',
            title: 'New Complaint Submitted',
            message: `New complaint in ${category} category: ${title}`,
            type: 'info',
            relatedComplaint: complaint.complaintId
        });

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully',
            complaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting complaint'
        });
    }
};

// Get Student Complaints
exports.getStudentComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ studentId: req.user.identifier })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints'
        });
    }
};

// Get Staff Complaints
exports.getStaffComplaints = async (req, res) => {
    try {
        const { status, category } = req.query;
        let filter = {};

        // Filter by category based on staff department
        const departmentCategories = {
            'hostel': ['Hostel Maintenance'],
            'academics': ['Academics'],
            'library': ['Library'],
            'infrastructure': ['Infrastructure', 'Sports Facilities', 'Canteen'],
            'administration': ['Administration', 'Other']
        };

        if (departmentCategories[req.user.department]) {
            filter.category = { $in: departmentCategories[req.user.department] };
        }

        // Apply status filter
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Apply category filter
        if (category && category !== 'all') {
            filter.category = category;
        }

        const complaints = await Complaint.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            complaints
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints'
        });
    }
};

// Update Complaint Status
exports.updateComplaint = async (req, res) => {
    try {
        const { status, assignedTo, staffNotes, resolution } = req.body;

        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Update complaint
        const updatedComplaint = await Complaint.findOneAndUpdate(
            { complaintId: req.params.id },
            {
                status,
                assignedTo,
                staffNotes,
                resolution,
                lastUpdated: Date.now()
            },
            { new: true, runValidators: true }
        );

        // Create notification for student
        if (status === 'Resolved' && resolution) {
            await Notification.create({
                userId: complaint.studentId,
                userType: 'student',
                title: 'Complaint Resolved',
                message: `Your complaint "${complaint.title}" has been resolved`,
                type: 'success',
                relatedComplaint: complaint.complaintId
            });
        }

        res.status(200).json({
            success: true,
            message: 'Complaint updated successfully',
            complaint: updatedComplaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating complaint'
        });
    }
};

// Get Complaint Details
exports.getComplaintDetails = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ complaintId: req.params.id });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Check if user has permission to view this complaint
        if (req.user.userType === 'student' && complaint.studentId !== req.user.identifier) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching complaint details'
        });
    }
};

// Submit Rating
exports.submitRating = async (req, res) => {
    try {
        const { score, comment } = req.body;

        const complaint = await Complaint.findOne({ 
            complaintId: req.params.id,
            studentId: req.user.identifier 
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        if (complaint.status !== 'Resolved') {
            return res.status(400).json({
                success: false,
                message: 'Can only rate resolved complaints'
            });
        }

        complaint.rating = {
            score,
            comment,
            ratedAt: new Date()
        };

        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Rating submitted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting rating'
        });
    }
};