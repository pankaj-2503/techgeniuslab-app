const nodemailer = require('nodemailer');
const _ = require("lodash");
const axios = require("axios");
const generateOTP = require('../Middleware/otp-generator');
const bcrypt = require("bcrypt");

const User = require('../Model/userModel');
const OTP_Model= require('../Model/otpModel');

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT ,
    secure: false,

    auth:{
        user: process.env.USER,
        pass: process.env.PASS 

    }
});
const OTP = generateOTP;

const jwt = require('jsonwebtoken');
const generateAuthToken = (user) => {
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email, // Use emailID instead of username
        // Add any other user information you want to include in the token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2h' } // Token will expire in 2 hours
    );
  
    return token;
  };

  // Login for the user
  module.exports.signUp = async (req, res) => {
    const emails = req.body.email;
    
    
    // user can get otp single time: one email can login one time: which is not correct for this sytem
    // const user = await User.findOne({
    //     email: emails
    // });
    // if (user) return res.status(400).send("User already registered!");
   
   
    // otp already taken -- line 19
   
   // sending mail from nodemailer-- to to user..
   
   
   var mailOptions = {
    from: 'techgeniouslab@gmail.com',
    to: emails,
    subject: 'otp -- does not share this code',
    text:`hello your otp is ${OTP} this otp is valid  only for 10 minutes` 

    };

    transporter.sendMail(mailOptions,function(error,info){
      if(error){
          console.log(error);
      }else{
        console.log("Email sent succesfully");
      }
    });

    const email = req.body.email;
  
    console.log(OTP);
    const otpInstance = new OTP_Model({ email: email, otp: OTP });
    
    const salt = await bcrypt.genSalt(10)
    otpInstance.otp = await bcrypt.hash(otpInstance.otp, salt);
    const result = await otpInstance.save();
    return res.status(200).send("Otp send successfully!");
   }
   // verify otp for registration and validate 
   module.exports.verifyOtp = async (req, res) => {
    const otpHolder = await OTP_Model.find({
        email: req.body.email
    });
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.email === req.body.email && validUser) {
        const user = new User(_.pick(req.body, ["email"]));
       // const token = user.generateJWT();

        // Generate and send the JWT token in the response
        const authToken = generateAuthToken(user);
        console.log('the token part : '+ authToken);
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      res.cookie('jwtd',authToken,{
        maxAge: sevenDaysInMilliseconds,
        httpOnly:true,
        //secure:true
      });
      res.send("cookie send completed");
        
        // to dev- debug -- delete it during production
        console.log(authToken);
        const result = await user.save();
        const OTPDelete = await OTP_Model.deleteMany({
            email: rightOtpFind.email
        });
        } 
        else {
        return res.status(400).send("Your OTP was wrong!")
    }
}










 