const router = require('express').Router();
const { signUp, verifyOtp, verifyAccount,isUserVerified } = require('../Controller/UserController');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);

router.route('/isuserverified')
    .post(isUserVerified);

module.exports = router;