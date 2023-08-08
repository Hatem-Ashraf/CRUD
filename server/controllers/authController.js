const User = require('../models/User')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require('dotenv').config();  i don't have to require the dotenv in each file, instead i can require it in the top most line in the server.js

//---------------------------  Student ------

const studentLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(req.body)
        if (!username || !password) return res.status(400).json({ "msg": "username and password are required!" })
        const foundUser = await User.findOne({ username: username }).exec()
        if (!foundUser) return res.status(401).send("Invalid username") //unauthorized
        //evaluate password
        const match = await bcrypt.compare(password, foundUser.password)
        if (match) {
            const roles = Object.values(foundUser.roles)
            //create JWTs
            const accessToken = jwt.sign(
                {
                    "userInfo":
                    {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            // Set the Authorization header to the access token
            res.set('Authorization', `Bearer ${accessToken}`);


            //we don't need to add the roles in the refresh token as the refresh token is just for making another access token
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            )

            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            // console.log("accesstoken from auth", accessToken)

            //the res.cookie(cookieName, token, options), maxAge is the lifetime of that cookie which is here 1 day
            //if iam testing the API with thounder client then i should remove the flag secure: true, because the /refresh route uses cookie and this make an issue with thounder client , but when working with browsers like chrome the flag should be existed
            res.cookie('jwt', accessToken, { httpOnly: true, sameSite: "None", maxAge: 60 * 60 * 1000 })//the flag 'secure: true' , this means that this cookie can be sent in https requests, and the sameSite: "None" is a flag that i added to fix the issue that caused when the user uses another domain. which is handled with credentials middleware i made
            // secure: true, i deleted it temporarly because it issues with thounder client for making cookies
            //this accesstoken is sent to the front end and he sould store it somewhere in memory not in local storage or as cookie

            console.log(`access token : \n ${accessToken}`)
            res.redirect(`/onestudent/${foundUser._id}`)

        } else {
            return res.status(401).send("incorrect password or username") //unauthorized
        }
    } catch (err) {
        res.status(500).send("Internal server error")
    }
}

//---------------------------  Editor ------

//view
const editorDashboard = async (req, res) => {
    const local = {
        title: "WELCOME EDITOR"
    }
    res.redirect("http://localhost:3000/dropDown")
}

// controller
const editorLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) return res.status(400).json({ "msg": "username and password are required!" })
        const foundUser = await User.findOne({ username: username }).exec()
        if (!foundUser) return res.status(401).send("Invalid username") //unauthorized
        //evaluate password
        const match = await bcrypt.compare(password, foundUser.password)
        if (match) {
            const roles = Object.values(foundUser.roles)
            //create JWTs
            const accessToken = jwt.sign(
                {
                    "userInfo":
                    {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            // Set the Authorization header to the access token
            res.set('Authorization', `Bearer ${accessToken}`);


            //we don't need to add the roles in the refresh token as the refresh token is just for making another access token
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            )

            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            // console.log("accesstoken from auth", accessToken)

            //the res.cookie(cookieName, token, options), maxAge is the lifetime of that cookie which is here 1 day
            //if iam testing the API with thounder client then i should remove the flag secure: true, because the /refresh route uses cookie and this make an issue with thounder client , but when working with browsers like chrome the flag should be existed
            res.cookie('jwt', accessToken, { httpOnly: true, sameSite: "None", maxAge: 60 * 60 * 1000 })//the flag 'secure: true' , this means that this cookie can be sent in https requests, and the sameSite: "None" is a flag that i added to fix the issue that caused when the user uses another domain. which is handled with credentials middleware i made
            // secure: true, i deleted it temporarly because it issues with thounder client for making cookies
            //this accesstoken is sent to the front end and he sould store it somewhere in memory not in local storage or as cookie

            console.log(`access token : \n ${accessToken}`)
            res.redirect(`/usersdash/editor`)

        } else {
            return res.status(401).send("incorrect password or username") //unauthorized
        }
    } catch (err) {
        res.status(500).send("Internal server error")
    }
}

//--------------------------- Control ------
//view
const controlDashboard = async (req, res) => {
    const local = {
        title: "WELCOME CONTROL"
    }
    res.redirect("http://localhost:3000/dropDown")
}



//controller
const controlLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) return res.status(400).json({ "msg": "username and password are required!" })
        const foundUser = await User.findOne({ username: username }).exec()
        if (!foundUser) return res.status(401).send("Invalid username") //unauthorized
        //evaluate password
        const match = await bcrypt.compare(password, foundUser.password)
        if (match) {
            const roles = Object.values(foundUser.roles)
            //create JWTs
            const accessToken = jwt.sign(
                {
                    "userInfo":
                    {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            // Set the Authorization header to the access token
            res.set('Authorization', `Bearer ${accessToken}`);


            //we don't need to add the roles in the refresh token as the refresh token is just for making another access token
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '3d' }
            )

            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            // console.log("accesstoken from auth", accessToken)

            //the res.cookie(cookieName, token, options), maxAge is the lifetime of that cookie which is here 1 day
            //if iam testing the API with thounder client then i should remove the flag secure: true, because the /refresh route uses cookie and this make an issue with thounder client , but when working with browsers like chrome the flag should be existed
            res.cookie('jwt', accessToken, { httpOnly: true, sameSite: "None", maxAge: 60 * 60 * 1000 })//the flag 'secure: true' , this means that this cookie can be sent in https requests, and the sameSite: "None" is a flag that i added to fix the issue that caused when the user uses another domain. which is handled with credentials middleware i made
            // secure: true, i deleted it temporarly because it issues with thounder client for making cookies
            //this accesstoken is sent to the front end and he sould store it somewhere in memory not in local storage or as cookie

            console.log(`access token : \n ${accessToken}`)
            res.redirect('/usersdash/control')

        } else {
            return res.status(401).send("incorrect password or username") //unauthorized
        }
    } catch (err) {
        res.status(500).send("Internal server error")
    }
}

//-------------------------- logout ---------
const handleLogout = async (req, res) => {
    //frontend should delete the access token from the client memory
    const cookies = req.cookies
    //the optional chaining operator (?.) to check if the jwt property exists on the cookies object.
    if (!cookies?.jwt) {
        console.log("No jwt cookie found")
        return res.status(204) //No content, "no cookies found to delete"
    }
    const refreshToken = cookies.jwt

    //Looking in the database for a user with this refresh token
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) {
        //if there's no user has this refresh token so delete the cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: "None" })
        console.log("Cookie deleted successfully")
        return res.redirect("/")
    }
    //if there's user has this refresh token then delete the refresh token and the cookie
    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)

    res.clearCookie('jwt', { httpOnly: true, sameSite: "None" })
    console.log("Cookie deleted successfully")
    res.redirect("/")
}
//----------------------------------------------


module.exports = {
    studentLogin,
    editorLogin,
    editorDashboard,
    controlLogin,
    controlDashboard,
    handleLogout

}