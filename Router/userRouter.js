const router = require('express').Router();
const { signUp, verifyOtp, verifyAccount,verifyUserByToken,completeUserAccount } = require('../Controller/UserController');
const { authenticateToken } = require ('../Middleware/authMiddleware')
router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtp);

router.route('/isuserverified')
    .post(verifyUserByToken);

    // Route for updating a product by its ID
router.route('/completeuseraccount')
.post(completeUserAccount); 

module.exports = router;