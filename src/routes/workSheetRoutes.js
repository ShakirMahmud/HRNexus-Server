const express = require('express');
const { postWorkSheet, getWorkSheet, getWorkSheetById, updateWorkSheet, deleteWorkSheet } = require('../controllers/workSheetController');
const {verifyToken, verifyEmployee} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/',verifyToken, verifyEmployee, postWorkSheet);
router.get('/:email?', verifyToken, getWorkSheet);
router.get('/:id', verifyToken, getWorkSheetById);
router.put('/:id', verifyToken, verifyEmployee, updateWorkSheet);
router.delete('/:id', verifyToken, verifyEmployee, deleteWorkSheet);

module.exports = router;