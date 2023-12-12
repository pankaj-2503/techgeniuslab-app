const async = require('hbs/lib/async');
const jwt = require('jsonwebtoken');

const user_register = require('../Model/userModel');

const auth = async (req,res,next) =>{
    try {
       console.log("working");
        const token = req.cookies.jwt;

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const curruser = await user_register.findOne({email:verifyUser._id});

        req.token = token;
        req.curruser = curruser;
        res.status(200).send('working fine authorized data sent succesfully');
        next();
        
        
    } catch (error) {
        res.status (401).send('authentication problem '+error);
       
    }


}

module.exports = auth;