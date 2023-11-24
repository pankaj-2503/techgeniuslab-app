const router = require('express').Router();
const { signUp, verifyOtp } = require('../controllers/userController');

router.route('/signup')
    .post(signUp);
