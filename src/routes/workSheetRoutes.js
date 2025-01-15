const express = require('express');
const { postWorkSheet, getWorkSheet } = require('../controllers/workSheetController');
const {verifyToken, verifyEmployee} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', postWorkSheet);
router.get('/', getWorkSheet);

module.exports = router;