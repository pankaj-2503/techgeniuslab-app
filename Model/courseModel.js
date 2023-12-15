const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
  lectureID: {
    type: String,
    required: true,
  },
  lectureTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // courseId: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   ref: 'Course',
  // },
});

const CourseSchema = new Schema({
  courseId: {
    type: Number,
    required: true
  },
  courseTitle: {
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
  thumbnail: {
    type: String,
  },
  introVideoUrl:{
    type: String,
  },
  lectures: [LectureSchema],
  published: {
    type: String,
    enum: ['Published', 'Not Published'],
  }
});

module.exports = mongoose.model('Course', CourseSchema);
module.exports = mongoose.model('Lecture', LectureSchema);
