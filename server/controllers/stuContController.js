const stuControl = require('../models/studentsControl');
const mongoose = require('mongoose');

const createNewStudent = async (req, res) => {
  try {
    const { name, department, subDepartment, type, courses } = req.body;

    // Check if the courses array exists and is not empty
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: 'Courses array is missing or empty.' });
    }
    courses.forEach(course => {
      course.reExam = course.reExam === 'on'; // Convert 'on' to true, or undefined to false
    });
    let totalGpaPoints = 0;
    const total_points = courses.reduce((acc, course) => {

      course.c_hours = Number(course.c_hours)
      course.year_works = Number(course.year_works)
      // course.reExam_year_works = Number(course.reExam_year_works)
      course.oral_p = Number(course.oral_p)
      // course.reExam_oral_p = Number(course.reExam_oral_p)
      course.written = Number(course.written)
      // course.reExam_written = Number(course.reExam_written)
      course.course_total_degree = Number(course.course_total_degree)

      const total = course.year_works + course.oral_p + course.written;
      const perc = (total / course.course_total_degree) * 100;
      console.log(`typeof course.year_works:${typeof (course.year_works)} typeof course.oral_p:${typeof (course.oral_p)} typeof course.written:${typeof (course.written)}`)
      console.log(`perc:${perc} total:${total} course.course_total_degree:${course.course_total_degree}`);
      let GPA;
      if (perc >= 95) GPA = "A+";
      else if (perc >= 90 && perc < 95) GPA = "A";
      else if (perc >= 85 && perc < 90) GPA = "A-";
      else if (perc >= 80 && perc < 85) GPA = "B+";
      else if (perc >= 75 && perc < 80) GPA = "B";
      else if (perc >= 70 && perc < 75) GPA = "B-";
      else if (perc >= 65 && perc < 70) GPA = "C+";
      else if (perc >= 60 && perc < 65) GPA = "C";
      else if (perc >= 55 && perc < 60) GPA = "C-";
      else if (perc >= 53 && perc < 55) GPA = "D+";
      else if (perc >= 50 && perc < 53) GPA = "D";
      else GPA = "F";

      const points = GPA === "A" || GPA === "A+" ? 4 :
        GPA === "A-" ? 3.7 :
          GPA === "B+" ? 3.3 :
            GPA === "B" ? 3 :
              GPA === "B-" ? 2.7 :
                GPA === "C+" ? 2.3 :
                  GPA === "C" ? 2 :
                    GPA === "C-" ? 1.7 :
                      GPA === "D+" ? 1.3 :
                        GPA === "D" ? 1 :
                          GPA === 'F' ? 0 : 0; // set default value as 0 if GPA is not valid

      course.GPA = GPA.toString(); // convert GPA value to string
      course.points = points;
      totalGpaPoints += points;

      return acc + points;
    }, 0);

    const total_points_3 = Number((totalGpaPoints * 3).toFixed(2));
    const total_points_avg = total_points / courses.length;

    const GPA_avg = total_points_avg >= 4 || total_points_avg >= 4 ? "A" :
      total_points_avg >= 3.7 ? "A-" :
        total_points_avg >= 3.3 ? "B+" :
          total_points_avg >= 3 ? "B" :
            total_points_avg >= 2.7 ? "B-" :
              total_points_avg >= 2.3 ? "C+" :
                total_points_avg >= 2 ? "C" :
                  total_points_avg >= 1.7 ? "C-" :
                    total_points_avg >= 1.3 ? "D+" :
                      total_points_avg >= 1 ? "D" :
                        total_points_avg >= 0 ? "F" : "F";
    const total_points_final = total_points_avg;
    const GPA_final = GPA_avg;

    let next_study;

    if (type === "تمهيدي") {

      if (total_points_final >= 3) next_study = "ماجستير العلوم"
      else if (total_points_final >= 2.3) next_study = "ماجستير الهندسه"
      else if (total_points_final >= 2) next_study = "ناجح"
      else next_study = "راسب"

    } else if (type === "ماجستير الهندسه") {

      if (total_points_final >= 2) next_study = "ناجح"
      else next_study = "راسب"

    } else if (type === "ماجستير العلوم") {

      if (total_points_final >= 3) next_study = "دكتوراه"
      else if (total_points_final >= 2) next_study = "ناجح"
      else next_study = "راسب"

    } else if (type === "دكتوراه") {
      if (total_points_final >= 2) next_study = "ناجح"
      else next_study = "راسب"
    }

    const newStudent = new stuControl({
      name,
      department,
      subDepartment,
      type,
      courses,
      total_points_3,
      total_points_avg,
      GPA_avg,
      total_points_final,
      GPA_final,
      next_study,
    });

    const result = await newStudent.save();
    console.log("Student created successfully");
    console.log("new student:\n", result);
    req.flash('info', 'New student added'); // Set flash message using req.flash()
    // res.redirect('/views/index');
    res.redirect(`/stuResult/create/${result._id}`)


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createNewStudent,
};
