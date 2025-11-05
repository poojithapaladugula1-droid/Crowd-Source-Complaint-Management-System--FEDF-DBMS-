const express = require('express');
const {
    getNotifications,
    markNotificationsRead,
    getProfile
} = require('../controllers/userController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', auth, getProfile);
router.get('/notifications', auth, getNotifications);
router.put('/notifications/read', auth, markNotificationsRead);

module.exports = router;