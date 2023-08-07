
const Course = require('../models/Course');

const addCourse = async (req, res) => {
  try {
    const departments = ['Electrical Engineering', 'Mechanical Engineering','Civil Engineering','Architecture','Surveying Engineering']; // Replace with your actual department list
    const subDepartments = {
      'Electrical Engineering': ['Electrical Power', 'Computer','Electronic and Communications'],
      'Mechanical Engineering': ['Mechanical Power', 'Production','Mechatronics'],
      'Civil Engineering' :['Structures','General Civil'],
      'Architecture':['Architecture'],
      'Surveying Engineering':['Surveying Engineering'],
    }; 

    const local = {
      title: "course-page",
      departments,
      subDepartments,
    };

    res.render('students/addCourse', local);
  } catch (error) {
    console.log(error);
  }
};

const postCourse = async (req, res) => {
  const bd = req.body;
  const requiredProps = ["name", "course_hours", "year_works", "oral_p", "written", "department", "subDepartment"];

  // Check if any required property is missing
  const missingProps = requiredProps.filter((prop) => !bd.hasOwnProperty(prop));
  if (missingProps.length > 0) {
    return res.status(400).json({ msg: `The following properties are required: ${missingProps.join(", ")}` });
  }

  const course = {
    name: req.body.name,
    course_hours: req.body.course_hours,
    year_works: req.body.year_works,
    oral_p: req.body.oral_p,
    written: req.body.written,
    exam_hours: req.body.exam_hours,
    department: req.body.department,
    subDepartment: req.body.subDepartment,
  };
  
  try {
    const result = await Course.create(course);
    console.log(result);
    req.flash('info', 'New course added'); // Set flash message using req.flash()
    res.redirect('/'); // Redirect to the viewCourse page
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};


const editCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id });
    if (!course) {
      console.log('Course not found'); // Add this line to check if course is null
      // Handle the case when course is null (e.g., render an error page)
    } else {
      const departments = ['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Architecture', 'Surveying Engineering']; // Replace with your actual department list
      const subDepartments = {
        'Electrical Engineering': ['Electrical Power', 'Computer', 'Electronic and Communications'],
        'Mechanical Engineering': ['Mechanical Power', 'Production', 'Mechatronics'],
        'Civil Engineering': ['Structures', 'General Civil'],
        'Architecture': ['Architecture'],
        'Surveying Engineering': ['Surveying Engineering'],
      };
      
      const local = {
        title: 'Edit Course Data',
        departments,
        subDepartments,
        course,
      };
      res.render('students/editCourse',local);
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};

const editCoursePost = async (req, res) => {
 
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      course_hours: req.body.course_hours,
      year_works: req.body.year_works,
      oral_p: req.body.oral_p,
      written: req.body.written,
      exam_hours: req.body.exam_hours,
      department: req.body.department,
      subDepartment: req.body.subDepartment,
      updatedAt: Date.now(),
    });
    req.flash('info', 'course updated'); // Set flash message using req.flash()
    res.redirect('/'); // Redirect to the dashboard route
  } catch (error) {
    console.log(error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.params.id });
    
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  postCourse,
  addCourse,
  editCourse,
  editCoursePost,
  deleteCourse,

}