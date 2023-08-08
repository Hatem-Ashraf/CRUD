const stuControl = require('../models/studentsControl');

const getOneStudent = async (req, res) => {
    try {
        const student = await stuControl.findOne({ _id: req.params.id }).exec();

        if (!student) return res.status(400).send(`No student found for this ID: ${req.params.id}`);

        res.render('students/StudentResult', { student }); // Pass an object with the key 'student'

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};



module.exports = {
    getOneStudent
}