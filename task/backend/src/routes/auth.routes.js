const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/profile', auth, authController.getProfile);

module.exports = router;