const router = require('express').Router();
const { signUp, verifyOtp } = require('../Controller/UserController');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);

module.exports = router;