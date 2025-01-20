const express = require('express');
const { createPaymentIntent, createPayment, getPayments, updatePayment } = require('../controllers/paymentController');
const { verifyToken, verifyAdmin, verifyAdminOrHR } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/paymentIntent',verifyToken, verifyAdmin, createPaymentIntent);
router.post('/', verifyToken, verifyAdminOrHR, createPayment);
router.put('/:id', verifyToken, verifyAdmin, updatePayment);
router.get('/:email?', verifyToken, getPayments);

module.exports = router;