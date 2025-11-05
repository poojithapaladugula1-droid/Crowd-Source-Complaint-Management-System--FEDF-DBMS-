const Notification = require('../models/Notification');

// Get Notifications
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { userId: req.user.identifier },
                { userType: req.user.userType }
            ]
        }).sort({ createdAt: -1 }).limit(20);

        const unreadCount = await Notification.countDocuments({
            $or: [
                { userId: req.user.identifier },
                { userType: req.user.userType }
            ],
            isRead: false
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

// Mark Notifications as Read
exports.markNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                $or: [
                    { userId: req.user.identifier },
                    { userType: req.user.userType }
                ],
                isRead: false
            },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'Notifications marked as read'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating notifications'
        });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
};