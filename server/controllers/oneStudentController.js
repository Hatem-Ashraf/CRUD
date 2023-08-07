const Student = require('../models/Students')

const getOneStudent = async (req, res) => {
    try {
        const bd = req.body
        const student = await Student.findOne({ _id: req.params.id }).exec()

        if (!student) return res.status(400).send(`No student found for this ID :${req.params.id}`)

        res.json(student)

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal server error")
    }
}

module.exports = {
    getOneStudent
}