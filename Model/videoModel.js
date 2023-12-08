const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
  },
  lectureId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Lecture',
  },
});

module.exports = mongoose.model('Video', VideoSchema);
