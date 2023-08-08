const Student = require('../models/Student');
const Course = require('../models/Course');
const User = require('../models/User');

const stuControl = require('../models/studentsControl');

const mongoose = require('mongoose');
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
//dashboard and print the student according to dep and SubDep
exports.homepage = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "my page",
    userRoles: req.roles, // Pass user roles to the template
    ROLES_LIST: ROLES_LIST, 
  };
  let perPage = 12;
  let page = req.query.page || 1;

  try {
    // Retrieve the selected main and secondary departments from the session
    const mainDepartment = req.session.mainDepartment;
    const secondaryDepartment = req.session.secondaryDepartment;

    // Modify the database query to filter students based on the selected department and sub-department
    const students = await stuControl.aggregate([
      { $match: { department: mainDepartment, subDepartment: secondaryDepartment } },
      { $sort: { updatedAt: -1 } },
      { $skip: perPage * page - perPage },
      { $limit: perPage },
    ]).exec();

    const count = await stuControl.countDocuments({
      department: mainDepartment,
      subDepartment: secondaryDepartment,
    });

    res.render('index', { local, students, current: page, pages: Math.ceil(count / perPage), messages});
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.viewMarks = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "grades",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    // Retrieve the selected main and secondary departments from the session
    const mainDepartment = req.session.mainDepartment;
    const secondaryDepartment = req.session.secondaryDepartment;

    // Modify the database query to filter students based on the selected department and sub-department
    const students = await stuControl.aggregate([
      { $match: { department: mainDepartment, subDepartment: secondaryDepartment } },
      { $sort: { updatedAt: -1 } },
      { $skip: perPage * page - perPage },
      { $limit: perPage },
    ]).exec();

    const count = await stuControl.countDocuments({
      department: mainDepartment,
      subDepartment: secondaryDepartment,
    });
    let maxNumCourses = 0;
students.forEach((student) => {
  if (student.courses.length > maxNumCourses) {
    maxNumCourses = student.courses.length;
  }})
    res.render('students/viewGrades', { local, students, current: page, pages: Math.ceil(count / perPage), messages,maxNumCourses });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};






//search for the student using the name and the department in the same session according to dep and subDep
exports.searchStudents = async (req, res) => {
  const local = {
    title: "my page",
  };
  try {
    let searchTerm = req.body.searchTerm || req.session.searchTerm || '';
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const regex = new RegExp(searchNoSpecialChar, "i"); // "i" flag for case-insensitive search

    // Retrieve the selected main and secondary departments from the session
    const mainDepartment = req.session.mainDepartment;
    const secondaryDepartment = req.session.secondaryDepartment;

    const students = await stuControl.find({
      $and: [
        { $or: [{ name: { $regex: regex } }, { department: { $regex: regex } }] },
        { department: mainDepartment, subDepartment: secondaryDepartment },
      ],
    });

    req.session.searchTerm = ''; // Reset the search term in the session

    if (students.length === 0) {
      // If no search results found, render a message in the view
      res.render("search", {
        students: [],
        local,
        message: "No results found.",
      });
    } else {
      // If search results are found, render the students in the view
      res.render("search", {
        students,
        local,
      });
    }
  } catch (error) {
    console.log(error); // Log the error for debugging purposes
    res.status(500).send("Internal Server Error"); // Send an appropriate error response
  }
};


//about  page 
exports.about = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "about page",
  };
  try {
    res.render('about', { local});
  } catch (error) {
    console.log(error);
  }

};


// exports.viewMarks = async (req, res) => {
//   const local = {
//     title: "view marks page",
//   };
//   try {
//     res.render('students/viewMarks', { local});
//   } catch (error) {
//     console.log(error);
//   }

// };

// Controller function to handle fetching students based on selected department and sub-department
exports.getStudentsMarks = async (req, res) => {
  try {
    // Retrieve the selected main and secondary departments from the session (after processing the cascading dropdown selection)
    // Retrieve the selected main and secondary departments from the session
    const mainDepartment = req.session.mainDepartment;
    const secondaryDepartment = req.session.secondaryDepartment;

    // Modify the database query to filter students based on the selected department and sub-department
    const students = await stuControl.aggregate([
      { $match: { department: mainDepartment, subDepartment: secondaryDepartment } },
    ]).exec();

    const count = await stuControl.countDocuments({
      department: mainDepartment,
      subDepartment: secondaryDepartment,
    });

    res.render('students/viewMarks', { students});
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
};

/*
exports.uploadGrades  = async (req,res)=>{
  res.render('students/uploadgrades');
}*/

//add new user

exports.addCustomer = async (req, res) => {
  const departments = ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Architecture', 'Surveying Engineering']; // Replace with your actual department list
  const subDepartments = {
    'Electrical Engineering': ['Electrical Power', 'Computer', 'Electronic and Communications'],
    'Mechanical Engineering': ['Mechanical Power', 'Production', 'Mechatronics'],
    'Civil Engineering': ['Structures', 'General Civil'],
    'Architecture': ['Architecture'],
    'Surveying Engineering': ['Surveying Engineering'],
  };
  const local = {
    title: "student-page",
    departments,
    subDepartments,
  };
  res.render('students/uploadgrades', local);
};


exports.viewStudent = async (req, res) => {
  try {
    const student = await stuControl.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'view Student Data',
      };
      res.render('students/viewStudent', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};


exports.edit= async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'Edit Student Data',
      };
      res.render('students/edit', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};

//----------------- update student infos section  -------------------
exports.updateCustomer = async (req, res) => {
  try {
    
    const bd = req.body
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ "msg": `Invalid ID: ${req.params.id}` });
    }
    const userFound = await stuControl.findOne({ _id: req.params.id }).exec()

    if (!userFound) return res.status(400).json({ "msg": `No student fount for this ID: ${req.params.id}` })
    const local = {
      title: "update-student-page",
      userFound,
      id: userFound._id
    }
    res.render('students/updateStudent', local);
    } catch (err) {
    console.error(err)
    res.status(500).json({ "msg": "something went wrong" })
  }
};

exports.update = async (req, res) => {
  try {
    const bd = req.body
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ "msg": `Invalid ID: ${req.params.id}` });
    }
    const student = await stuControl.findOne({ _id: req.params.id }).exec()
    if (!student) return res.status(400).json({ "msg": "No students found" })

    const { name, department, subDepartment, type, courses } = req.body;

    let totalGpaPoints = 0;
    const total_points = courses.reduce((acc, course) => {
      
      course.c_hours = Number(course.c_hours)
      course.year_works = Number(course.year_works)
      course.reExam_year_works = Number(course.reExam_year_works)
      course.oral_p = Number(course.oral_p)
      course.reExam_oral_p = Number(course.reExam_oral_p)
      course.written = Number(course.written)
      course.reExam_written = Number(course.reExam_written)
      course.course_total_degree = Number(course.course_total_degree)

      const total = course.year_works + course.oral_p + course.written;
      const perc = total / course.course_total_degree * 100;
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
    const total_points_avg = totalGpaPoints / courses.length;
    console.log(`total_points_3:${total_points_3},total_points_avg:${total_points_avg},  courses.length:${courses.length}`)

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

    total_points_final = total_points_avg
    GPA_final = GPA_avg

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


    student.name = name
    student.department = department
    student.subDepartment = subDepartment
    student.type = type
    student.courses = courses
    student.total_points_3 = total_points_3
    student.total_points_avg = total_points_avg
    student.GPA_avg = GPA_avg
    student.total_points_final = total_points_final
    student.GPA_final = GPA_final
    student.next_study = next_study
    // const newStudent = new stuControl({
    //   name,
    //   department,
    //   subDepartment,
    //   type,
    //   courses,
    //   total_points_3,
    //   total_points_avg,
    //   GPA_avg,
    //   total_points_final,
    //   GPA_final,
    //   next_study
    // });

    const result = await student.save();
    console.log(`result:${result}`)
    console.log("student updated successfully")

    // res.redirect(`/students/${student._id}`)
   
    //send status code 200 "ok" to the client side
    req.flash('info', 'Student updated successfully'); // Set flash message using req.flash()
    res.status(200).json(result)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
//----------------- end of update student infos section  -------------------



exports.editPost= async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id,{
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      tel:req.body.tel,
      details:req.body.details,
      email:req.body.email,
      updatedAt:Date.now(),

    });
    res.redirect(`/edit/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }
};

// customerController.js

exports.deleteStudent= async (req, res) => {
  try {
    await stuControl.deleteOne({_id: req.params.id});
    req.flash('info', 'Student deleted successfully.');
    res.redirect('/views/index');

  } catch (error) {
    console.log(error);
  }
};

exports.allCoursesDashboard = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "All Courses Dashboard",
  };

  try {
    // Retrieve the selected main and secondary departments from the session
    const mainDepartment = req.session.mainDepartment;
    const secondaryDepartment = req.session.secondaryDepartment;

    // Fetch the courses related to the selected main and secondary departments
    const courses = await Course.find({
      department: mainDepartment,
      subDepartment: secondaryDepartment,
    });

    res.render('students/viewCourse', {
      local,
      courses, // Pass the filtered courses to the view for display
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};




/********************************   DROP DOWN MENU ********************/

exports.dropDown = async (req, res) => {
  const local = {
    title: "drop down menue",
  };
  res.render('students/dropDown', local);
};

//lama b3mel select mn el dropwdon menu  and redirect it to the courses dashBoard 
exports.processDropDown = async (req, res) => {
  // Retrieve the selected main and secondary departments from the form submission
  const mainDepartment = req.body.mainDepartment.trim(); // Trim leading/trailing spaces
  const secondaryDepartment = req.body.secondaryDepartment.trim(); // Trim leading/trailing spaces

  // Store the selected departments in the session
  req.session.mainDepartment = mainDepartment;
  req.session.secondaryDepartment = secondaryDepartment;

  try {
    // Assuming you have departments and sub-departments lists defined in your code
    const departments = ['Electrical Engineering', 'Mechanical Engineering','Civil Engineering','Architecture','Surveying Engineering']; // Replace with your actual department list
    const subDepartments = {
      'Electrical Engineering': ['Electrical Power', 'Computer','Electronic and Communications'],
      'Mechanical Engineering': ['Mechanical Power', 'Production','Mechatronics'],
      'Civil Engineering' :['Structures','General Civil'],
      'Architecture':['Architecture'],
      'Surveying Engineering':['Surveying Engineering'],
    }; 

    // Fetch the courses related to the selected main and secondary departments
    const courses = await Course.find({
      department: mainDepartment,
      subDepartment: secondaryDepartment,
    });

    // Redirect to the courses dashboard with the filtered courses
   // return res.render('/homepage', { courses, departments, subDepartments });
   exports.homepage(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

