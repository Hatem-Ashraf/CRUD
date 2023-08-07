const mongoose = require('mongoose')

const StuSchema = new mongoose.Schema({

    name: { type: String, required: true },
    department: { type: String, required: true },
    subDepartment: { type: String, required: true },
    info: [
        {
            course_name: String,
            GPA: String,
            points: Number
        }
    ],
    type: { type: String, enum: ['تمهيدي', 'ماجستير الهندسه', 'ماجستير العلوم', 'دكتوراه'], required: true },
    total_points_3: Number,
    total_points_final: Number,
    GPA_final: String,
    next_study: String,
})

module.exports = mongoose.model("Students", StuSchema)