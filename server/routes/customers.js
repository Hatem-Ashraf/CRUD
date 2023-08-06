// routes/index.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/dash',customerController.homepage);
router.get('/about',customerController.about);
router.get('/add',customerController.addCustomer);
//router.post('/add',customerController.postStudent);
router.get('/view/:id', customerController.view);
router.get('/edit/:id', customerController.edit);
// router.get('/update/:id', customerController.update);

router.put('/edit/:id', customerController.editPost);
router.delete('/edit/:id', customerController.deleteStudent);
router.all('/search', customerController.searchStudents);
router.get('/viewCourse', customerController.allCoursesDashboard);
//drop down menue
router.get('/dropDown', customerController.dropDown);
// Route for processing the form submission from the cascading dropdown menu page
router.post('/dropDown', customerController.processDropDown);

//router.get('/uploadgrades',customerController.uploadGrades);

module.exports = router;