
const mongoose = require('mongoose');

const stuControlSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  subDepartment: { type: String, required: true },
  type: { type: String, enum: ['تمهيدي', 'ماجستير الهندسه', 'ماجستير العلوم', 'دكتوراه'], required: true },
  courses: [
    {
      name: { type: String, required: true },
      c_hours: { type: Number, required: true },
      year_works: { type: Number, required: true },
      reExam_year_works: { type: Number,default:0  },
      oral_p: { type: Number, required: true },
      reExam_oral_p: { type: Number, default:0},
      written: { type: Number, required: true },
      reExam_written: { type: Number, default:0 },

      total: {
        type: Number,
        default: function () {
          return Math.max(this.year_works , this.reExam_year_works)  + Math.max(this.oral_p ,this.reExam_oral_p) + Math.max(this.written,this.reExam_written) ;
        }
      },
      course_total_degree: { type: Number, required: true }, // the total degree of the course itself not the student degree
      perc: {
        type: Number,
        default: function () {
          return (this.total / this.course_total_degree) * 100;
        }
      },
      reExam: { type: Boolean, default: false },
      GPA: { type: String },
      points: { type: Number }
    }
  ],
  total_points_3: { type: Number }, // (sum of all GPA) * 3
  total_points_avg: { type: Number }, // (sum of all GPA) / number of courses
  GPA_avg: { type: String }, // if the total_points_avg is 3.50 then it's B+ not A
  total_points_final: { type: Number }, // the final total points like total_points_avg, but this will be stored in the Students table as the final value
  GPA_final: { type: String }, // the final GPA like GPA_avg like the total_points_final
  next_study: { type: String }, // this should be handled either in the controller or by the user
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  }
});

const stuControl = mongoose.model('stuControl', stuControlSchema);
module.exports = stuControl;
