
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

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
  console.log(token);
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Token not provided' });
    }
  
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decode; //Set the user information in the request object;
      next();
    }
    //jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      //if (err) {
    catch (error) {    
      console.error('Error during token verification')
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
      }
  
      //req.user = user; // Set the user information in the request object
      //next();
   // });
  };
  
module.exports = {auth,authenticateToken};