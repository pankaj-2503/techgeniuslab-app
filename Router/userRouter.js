const router = require('express').Router();
const { signUp, verifyOtp, verifyAccount,verifyUserByToken } = require('../Controller/UserController');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);

router.route('/isuserverified')
    .post(verifyUserByToken);

module.exports = router;