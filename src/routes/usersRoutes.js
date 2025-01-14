const express = require('express');
const { getUsers, addUser, checkUserByEmail, getAdmins, getHRs, getEmployees } = require('../controllers/usersController');
const { verifyToken, verifyAdmin, verifyEmployee, verifyHR } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/check', checkUserByEmail);
router.get('/admin/:email', verifyToken, getAdmins);
router.get('/hr/:email', verifyToken, getHRs);
router.get('/employee/:email', verifyToken, getEmployees);

module.exports = router;