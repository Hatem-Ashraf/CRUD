const bcrypt = require('bcrypt')
const User = require('../models/User')
const Student = require('../models/Students')


//create new user
const handleNewUser = async (req, res) => {

    try {

        const randomName = Math.random().toString(36).substr(2, 4);
        const randomPwd = Math.floor(Math.random() * 90000000) + 10000000;

        const studentFound = await Student.findOne({ _id: req.params.id }).exec()
        if (!studentFound) return res.status(400).json({ "msg": `ID: ${req.params.id} for that user not found in Student Database` })
        const duplicate = await User.findOne({ username: randomName }).exec()
        if (duplicate) {
            const randomName = Math.random().toString(36).substr(2, 4);
        }

        //encrypt the passwrd
        const hashedPwd = await bcrypt.hash(randomPwd.toString(), 10)//10 is the salt

        //create and also store the new user 
        // const result = await User.create({
        //     "username": randomName,
        //     "password": hashedPwd,
        //     _id: req.params.id,
        //     "roles.User": 2001
        // })

        const result = await User.create({
            "username": randomName,
            "password": hashedPwd,
            "_id": req.params.id,
            "info":{
                "User" : 2001
            }
        })

        //there's another way to create and store the user
        /* const newUser = new User()
         newUser.username = user
         newUser.password = pwd
         const result = await newUser.save()

         or 
         const newUser = new User({
            "username" = user
            "password" = pwd
         })
         const result = await newUser.save()
        */

        console.log("username and password:\n", result)
        req.flash('info', `New student email created successfully\n username: ${randomName}, password: ${randomPwd}`);
        res.redirect(`/views/index`)


    } catch (err) {
        res.status(500).json({ "msg": err.message })
    }
}

const handleNewSuperuser = async (req, res) => {

    try {

        const { username, password } = req.body

        const duplicate = await User.findOne({ username: username }).exec()
        if (duplicate) return res.status(409).send("There's another user with that username") //conflict

        //encrypt the passwrd
        const hashedPwd = await bcrypt.hash(password.toString(), 10)//10 is the salt

        //create and also store the new user 
        const result = await User.create({
            "username": username,
            "password": hashedPwd,
            "roles": {
                "User": 2001
            }
        })

        //there's another way to create and store the user
        /* const newUser = new User()
         newUser.username = user
         newUser.password = pwd
         const result = await newUser.save()

         or 
         const newUser = new User({
            "username" = user
            "password" = pwd
         })
         const result = await newUser.save()
        */

        console.log(result)
        res.status(201).json({ "success": `New user email created successfully, username: ${username}, password: ${password}` })

    } catch (err) {
        res.status(500).json({ "msg": err.message })
    }
}
module.exports = {
    handleNewUser,
    handleNewSuperuser
}