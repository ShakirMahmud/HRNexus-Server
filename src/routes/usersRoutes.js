const express = require('express');
const { getUsers, addUser, checkUserByEmail, getAdmins, getHRs, getEmployees, updateUser, getUserByEmail } = require('../controllers/usersController');
const { verifyToken, verifyAdmin, verifyEmployee, verifyHR, verifyAdminOrHR } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/check', checkUserByEmail);
router.get('/admin/:email', verifyToken, getAdmins);
router.get('/hr/:email', verifyToken, getHRs);
router.get('/employee/:email', verifyToken, getEmployees);
router.put('/:id', verifyToken, verifyAdminOrHR, updateUser);
router.get('/:email', verifyToken, getUserByEmail);

module.exports = router;