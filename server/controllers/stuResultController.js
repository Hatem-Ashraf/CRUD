const mongoose = require('mongoose')

const Student = require('../models/Students')
const stuControl = require("../models/studentsControl")

const getAllStudents = async (req, res) => {
    try {
        const bd = req.body
        const students = await Student.find({ department: bd.department , subDepartment: bd.subDepartment }).exec()
        res.json(students)

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal server error")
    }
}

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

const createOneStudent = async (req, res) => {
    try {
        //the response from the createNewstudent and updateStudent should be a req to here then create the properties from that req 
        const studentFound = await stuControl.findOne( { _id: req.params.id } )
        if (!studentFound) return res.status(400).json({ "msg": `student ID ${req.params.id} not found` })

        const info = studentFound.courses.map(course => {
                return {
                    course_name: course.name,
                    GPA: course.GPA,
                    points: course.points
                }
            }
            )
        
        const _id = studentFound._id
        const department = studentFound.department
        const subDepartment = studentFound.subDepartment
        const name = studentFound.name
        const type = studentFound.type
        const total_points_3 = studentFound.total_points_3
        const total_points_final = studentFound.total_points_final
        const GPA_final = studentFound.GPA_final
        const next_study = studentFound.next_study

        const student = new Student({
            _id,
            name,
            department,
            subDepartment,
            info,
            type,
            total_points_3,
            total_points_final,
            GPA_final,
            next_study
        })

        const result =  await student.save()
        res.redirect(`/registers/${result._id}`)
    } catch (err) {
        console.error(err)
        res.status(500).send("Internal server error")
    }
}

const updateStudent = async (req, res) => {
    try {
        //the response from the createNewstudent and updateStudent should be a req to here then create the properties from that req 
        const studentCont = await stuControl.findOne( { _id: req.params.id } )
        const studentFound = await Student.findOne( { _id: req.params.id } )
        if (!studentFound || !studentCont ) return res.status(400).json({ "msg": `student ID ${req.params.id} not found` })

        const info = studentCont.courses.map(course => {
                return {
                    course_name: course.name,
                    GPA: course.GPA,
                    points: course.points
                }
            }
            )

        studentFound.department = studentCont.department
        studentFound.subDepartmen = studentCont.subDepartment
        studentFound.name = studentCont.name
        studentFound.info = info
        studentFound.type = studentCont.type
        studentFound.total_points_3 = studentCont.total_points_3
        studentFound.total_points_final = studentCont.total_points_final
        studentFound.GPA_final = studentCont.GPA_final
        studentFound.next_study = studentCont.next_study

        const result = await studentFound.save()
        res.json( result )

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal server error")
    }
}

const deleteStudent = async (req, res) => {
    try {

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ "msg": `Invalid ID: ${req.params.id}` });
      }
      const result = await Student.deleteOne({ _id: req.params.id })
      if (result.deletedCount == 0) return res.status(400).json({ "msg": "Student not found" })

      res.send("Student result deleted successfully")

    } catch (err) {
      console.error(err)
      res.status(500).json({ "msg": "something went wrong" })
    }
}

module.exports = {
    getAllStudents,
    getOneStudent,
    createOneStudent,
    updateStudent,
    deleteStudent
    
}