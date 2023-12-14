const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  imageUrl: {
    type: String,
  },
  published: {
    type: String,
    enum: ['Published', 'Not Published'],
  }
});

module.exports = mongoose.model('Course', CourseSchema);
