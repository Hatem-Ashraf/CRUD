const Student = require('../models/Students')

const getOneStudent = async (req, res) => {
    try {
        const bd = req.body
        const students = await Student.findOne({ _id: req.params.id }).exec()

        if (!students) return res.status(400).send(`No student found for this ID :${req.params.id}`)

        res.render('students/StudentResult', students)

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal server error")
    }
}

module.exports = {
    getOneStudent
}