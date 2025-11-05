const express = require('express');
const { 
    studentLogin, 
    staffLogin, 
    registerStudent, 
    registerStaff 
} = require('../controllers/authController');

const router = express.Router();

router.post('/student/login', studentLogin);
router.post('/staff/login', staffLogin);
router.post('/student/register', registerStudent);
router.post('/staff/register', registerStaff);

module.exports = router;