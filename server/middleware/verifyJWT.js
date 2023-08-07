const jwt = require('jsonwebtoken')
// require("dotenv").config() i don't have to require the dotenv in each file, instead i can require it in the top most line in the server.js

const verifyJWT = (req, res, next) => {
    console.log("-verifyJWT\n")
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).send("You need to login")
    const accessToken = cookies.jwt
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            //decoded is the payload in the accessToken that i set in the          jwt.verify() in the authController , the payload is the first part in the jwt.verify(), note that it's decoded not encoded, so it turned back to its original value
            if (err) {
            return res.status(403).send("Something went wrong in the verifyJWT") //invalid token
            }
            //Adding some credentials to the request from this middleware
            req.username = decoded.userInfo.username
            req.roles = decoded.userInfo.roles
            next()
        }
    )
}

module.exports = verifyJWT