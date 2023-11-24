const otpGenerator =require('otp-generator')

const { User } = require('../models/userModel')

const { Otp } = require('../models/otpModel')

const jwt = require('jsonwebtoken');


const generateAuthToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            number: user.email,
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn:'2h'} //Token will expires in 2 hours
    )
};


module.exports.signUp = async (req, res) => {
    const user = await User.findOne({
        number: req.body.number
    });
    if (user) return res.status(400).send("User already registered!");
    const OTP = otpGenerator.generate(6, {
        digits: true, alphabets: false, upperCase: false, specialChars: false
    });
    const number = req.body.number;
  //  const smsservice = new URLSearchParams();
   // smsservice.append('token', '05fa33c4cb50c35f4a258e85ccf50509');
   // smsservice.append('to', `+${number}`);
    //smsservice.append('message', `Verification Code ${OTP}`);
   /** axios.post('http://api.greenweb.com.bd/api.php', smsservice).then(response => {
        console.log(response.data);
    }); */
    console.log(OTP);
    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp send successfully!");
}

