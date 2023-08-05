// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course_hours: { type: Number, required: true },
  year_works: { type: Number, required: true },
  oral_p: { type: Number, required: true },
  written: { type: Number, required: true },
  total: {
    type: Number,
    default: function () {
      return this.year_works + this.oral_p + this.written;
    }
  },
  exam_hours: { type: Number },
  department: { type: String, required: true },
  subDepartment: { type: String, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
