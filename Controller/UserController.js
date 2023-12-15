const nodemailer = require('nodemailer');
const _ = require("lodash");
const axios = require("axios");
const generateOTP = require('../Middleware/otp-generator');
const bcrypt = require("bcrypt");

const User = require('../Model/userModel');
const OTP_Model= require('../Model/otpModel');
const jwt = require('jsonwebtoken');


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


 const generateAuthToken = (user) => {
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email, // Use emailID instead of username
        // Add any other user information you want to include in the token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' } // Token will expire in 7 days
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
        const sevenDaysInMilliseconds =  7 * 24 * 60 * 60 * 1000;
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



   // verify otp for registration and validate 
   module.exports.verifyAccount = async (req, res) => {
    
    // checking th email from request is available in the OTP database is present or not
    const otpHolder = await OTP_Model.find({
        email: req.body.email
    });
    
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.email === req.body.email && validUser) { //condition when OTP is verified successfully
        
      // To  check is the User already registered or new user
      const isuser = await User.findOne({
          email: req.body.email
        });

      if (isuser){ //condition: if user found in the REGISTERED_USER_COLLECTION
          //console.log("User is registered");
          
          const user_verified_status = isuser.is_verified;
          console.log(user_verified_status);

          if(user_verified_status) {

            // Generate and send the JWT token in the response

          const user = new User(_.pick(req.body, ["email"]));
          const authToken = generateAuthToken(user);
          console.log('the token part : '+ authToken);
          const sevenDaysInMilliseconds = 1000;
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
            return res.send("user is registered and verified");
          }
          else{ 
            return res.send("new user");
          }
          
          //return res.status(400).send("User already registered!");
        
        } 
        } 
        else {
        return res.status(400).send("Your OTP was wrong!")
     }
}



module.exports.verifyUserByToken = async(req, res) => {

  try {
    const userToken = req.body.token;
    //console.log(userToken);

    // Verify the JWT token
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);
    console.log("decoded token",decoded);


    // Find the user by email from the decoded token
    const user = await User.findOne({ email: decoded.email});
    console.log("user",user);
    if (!user) {
      // If user not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is verified
    const isVerified = user.is_verified;


     // Check if the user is created or not
     const isAccountCreated = user.is_account_created;

     if (isAccountCreated) {

      if (isVerified) {
        res.status().json({   isAccountCreated: true ,isVerified: true ,message: 'User is verified' });
      } else {
        res.status(401).json({  isAccountCreated: true ,isVerified: false ,error: 'User Account completed but not verified' });
      }

    } else {
      res.status(401).json({ isVerified: false ,error: 'User Account is not complet4ed' });
    }
    
    
  } catch (error) {

    if (error.name === 'TokenExpiredError') {
      console.error('Token Expired');
      res.status(401).json({ isTokenExpired: true ,error: 'Token Expired' });
    }
    else {
      console.error('Error in verifying user by token:', error);
      res.status(500).json({ error: 'Internal server error' });}
  }
}

module.exports.completeUserAccount = async (req, res) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1]; // Extract token from the Authorization header
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

    // Find the user by email from the decoded token
    const user = await User.findOne({ email: decoded.email, is_verified: false });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found or already verified.' });
    }

    // Extract fields from the request body
    const { userType, firstName, lastName, dateOfBirth, grade, schoolName, parentEmail } = req.body;

    // Update only the specified fields
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email, is_account_created: false },
      {
        $set: {
          userType,
          firstName,
          lastName,
          dateOfBirth,
          grade,
          schoolName,
          parentEmail,
          is_verified: false,
          is_account_created: true,
        },
      },
      { new: true }
    );

    res.json({ user: updatedUser, success: true, message: 'User verified and details updated successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    console.error('Error verifying and updating user details:', error);
    res.status(500).json({ success: false, message: 'An error occurred while verifying and updating user details.', error });
  }
};





 