const Course = require('../models/Course');

const addCourse = async (req, res) => {
  try {
    const departments = ['Electrical Engineering', 'Mechanical Engineering']; // Replace with your actual department list
    const subDepartments = {
      'Electrical Engineering': ['Communication', 'Electrical Power', 'Computer'],
      'Mechanical Engineering': ['Production', 'Power'],
    }; // Replace with your actual sub-department list

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


const updateCourse = async (req, res) => {
  const { name } = req.params;
  const updates = req.body;

  try {
    // Find the course by name and update it
    const course = await Course.findOneAndUpdate({ name }, updates, { new: true, runValidators: true });

    if (!course) {
      // If the course with the given name is not found, return a 404 response
      return res.status(404).json({ msg: "Course not found" });
    }

    // Update the total field
    course.total = course.oral_p + course.year_works + course.written;
    await course.save();

    // Return the updated course
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};



const deleteCourse = async (req, res) => {
  const { name } = req.params;

  try {
    // Find the course by name and delete it
    const result = await Course.deleteOne({ name });

    if (result.deletedCount === 0) {
      // If the course with the given name is not found, return a 404 response
      return res.status(404).json({ msg: "Course not found" });
    }

    // Return a success message
    res.json({ msg: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong");
  }
};


module.exports = {
  postCourse,
  addCourse,
  updateCourse,
  deleteCourse
}