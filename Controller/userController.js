const otpGenerator =require('otp-generator')

const { User } = require('../models/userModel')

const { Otp } = require('../models/otpModel')

const jwt = require('jsonwebtoken');


const generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            number: user.email,
        }
    )
}