const express = require('express');
const { getUsers, addUser, checkUserByEmail, getAdmins, getHRs } = require('../controllers/usersController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/check', checkUserByEmail);
router.get('/admin/:email', getAdmins);
router.get('/hr/:email', getHRs);

module.exports = router;