const Student = require('../models/Student');
const Course = require('../models/Course');
const stuControl = require('../models/studentsControl');

const mongoose = require('mongoose');

//dashboard and print the student according to dep and SubDep
exports.homepage = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "my page",
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

    res.render('index', { local, students, current: page, pages: Math.ceil(count / perPage), messages });
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


exports.view = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'view Student Data',
      };
      res.render('students/view', { local, student });
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

//delet student from the icon and its working 
exports.deleteStudent= async (req, res) => {
  try {
    await stuControl.deleteOne({_id: req.params.id});
    res.redirect('/');

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
    return res.render('students/viewCourse', { courses, departments, subDepartments });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Internal Server Error');
  }
};

