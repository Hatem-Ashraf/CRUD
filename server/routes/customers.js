// routes/index.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');


router.get('/viewgrads',customerController.viewMarks);



router.get('/views/index',customerController.homepage);

router.get('/viewgrads',customerController.viewMarks);

router.get('/about',customerController.about);

router.get('/viewMarks', customerController.getStudentsMarks);

router.get('/uploadgrades',customerController.addCustomer);
router.get('/uploadgrades/:id',customerController.updateCustomer);

//router.post('/add',customerController.postStudent);
router.get('/viewStudent/:id', customerController.viewStudent);

router.get('/edit/:id', customerController.edit);
router.put('/update/:id', customerController.update);

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