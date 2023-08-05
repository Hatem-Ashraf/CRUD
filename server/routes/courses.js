const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const Course = require('../models/Course');
// Route for rendering the form to add a new course
router.get('/addCourse', courseController.addCourse);
// Route for processing form data and adding the course
router.post('/addCourse', courseController.postCourse);
// Route for displaying the edit form for a course
router.get('/editCourse/:id', courseController.editCourse);
// Route for updating a course
router.post('/editCourse/:id', courseController.editCoursePost);

// Route for deleting a course
router.delete('/editCourse/:id', courseController.deleteCourse);
router.get('/api/courses', async (req, res) => {
    try {
      const { department, subDepartment } = req.query;
      const courses = await Course.find({ department, subDepartment }).exec();
      res.json({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
module.exports = router;
