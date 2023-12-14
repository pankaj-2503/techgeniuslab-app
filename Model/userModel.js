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
    required: true,
    enum: userTypeValues
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: Number,
    required: true
  },
  schoolName: {
    type: String,
    required: true
  },
  parentEmail: {
    type: String,
    required: true
  },
  tokens: [{
    token :{
       type:String,
       required:true
    }
 }]
});


// userSchema.methods.generateJWT = function () {
//     const token = jwt.sign({
//         _id: this._id,
//         number: this.number
//     }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
//     return token
// }

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
