const express = require('express');
const { postWorkSheet, getWorkSheet } = require('../controllers/workSheetController');
const {verifyToken, verifyEmployee} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',verifyToken, verifyEmployee, postWorkSheet);
router.get('/:email?', verifyToken, getWorkSheet);

module.exports = router;