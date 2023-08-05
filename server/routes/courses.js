const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');

// Route for rendering the form to add a new course
router.get('/addCourse', courseController.addCourse);

// Route for processing form data and adding the course
router.post('/addCourse', courseController.postCourse);

// Route for updating a course
router.patch('/:name', courseController.updateCourse);

// Route for deleting a course
router.delete('/:name', courseController.deleteCourse);

module.exports = router;
