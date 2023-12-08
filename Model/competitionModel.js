const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompetitionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
});

module.exports = mongoose.model('Competition', CompetitionSchema);
