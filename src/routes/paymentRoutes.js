const express = require('express');
const { createPaymentIntent, createPayment, getPayments } = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/paymentIntent', createPaymentIntent);
router.post('/', createPayment);
router.get('/:email?', verifyToken, getPayments);

module.exports = router;