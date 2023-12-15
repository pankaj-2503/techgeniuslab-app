const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userTypeValues = ['student', 'teacher', 'parent'];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure uniqueness of email addresses
  },
  userType: {
    type: String,
    
    enum: userTypeValues
  },
  firstName: {
    type: String
    
  },
  lastName: {
    type: String
    
  },
  dateOfBirth: {
    type: Date
    
  },
  grade: {
    type: Number
    
  },
  schoolName: {
    type: String
    
  },
  parentEmail: {
    type: String
    
  },
  is_verified: {
    type: Boolean,
    default: false,
    required: true
  },
  tokens: [{
    token :{
       type:String,
       required:true
    }
 }]
});


//---------------token generation for work modulle for authentication-------
userSchema.methods.generateAuthToken = async function(){
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  try{
     const token = jwt.sign({_id:this.email}, process.env.JWT_SECRET_KEY,{expiresIn: sevenDaysInMilliseconds});
      this.tokens = this.tokens.concat({token:token})
     await this.save();

     return token;
  }
  catch (error){
     res.status(400).send('the error part in token generation in user model ' + error);
     console.log('the error part in token generation in user model' + error);

  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
