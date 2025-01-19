const express = require('express');
const { postContact, getContact } = require('../controllers/contactController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', postContact);
router.get('/', verifyToken, verifyAdmin, getContact);

module.exports = router;