const express = require('express');
const { getUsers, addUser, checkUserByEmail } = require('../controllers/usersController');

const router = express.Router();

router.get('/', getUsers);
router.post('/', addUser);
router.get('/check', checkUserByEmail);

module.exports = router;