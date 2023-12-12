const nodemailer = require('nodemailer');
const generateOTP = require('../Middleware/otp-generator');
const bcrypt = require("bcrypt");

const { User } = require('../Model/userModel');
const { Otp } = require('../Model/otpModel');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port:   587 ,
    secure: false,

    auth:{
        user: 'salvinrai2411@gmail.com',
        pass: 'CBK7XOm0kP2AQF56' 

    }
});
const OTP = generateOTP;

const jwt = require('jsonwebtoken');
const generateAuthToken = (user) => {
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email, // Use mobileNumber instead of username
        // Add any other user information you want to include in the token
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '2h' } // Token will expire in 2 hours
    );
  
    return token;
  };

  // sign-up \ for the user
  module.exports.signUp = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send("User already registered!");
   // otp already taken -- line 19
   
   // sending mail from nodemailer-- to to user..
   var mailOptions = {
    from: 'techgeniouslab@gmail.com',
    to:'salvinrai24@gmail.com',
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
    const otp = new Otp({ email: email, otp: OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp send successfully!");
   }
   
   // verify otp for registration and validate 
   module.exports.verifyOtp = async (req, res) => {
    const otpHolder = await Otp.find({
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
        
        // to dev- debug -- delete it during production
        console.log(authToken);
        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            email: rightOtpFind.email
        });
        return res.status(200).send({
            message: "User Registration Successfull!",
            authToken,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}










 