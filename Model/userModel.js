const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true },
  email: { 
    type: String, 
    required: true },
  password: { 
    type: String, 
    required: true },
  userType: { 
    type: String, 
    required: true },
  firstName: { 
    type: String, 
    required: true },
  lastName: { 
    type: String, 
    required: true },
  dateOfBirth: { 
    type: Date, 
    required: true },
  grade: { 
    type: Number, 
    required: true },
  schoolName: { 
    type: String, 
    required: true },
  parentEmail: { 
    type: String, 
    required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
