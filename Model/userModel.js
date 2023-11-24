const mongoose = require('mongoose');
const jwt = require('')

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
  }
});


userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        _id: this._id,
        number: this.number
    }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return token
}


const User = mongoose.model('User', userSchema);

module.exports = User;
