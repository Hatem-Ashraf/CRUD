const verifyRoles = (...allowedRoles) => {
    //...alowedRoles in JS is any number of parameters
    return (req, res, next) => {
        if (!req?.roles){
            console.log("cannot find roles for this user")
            return res.status(401)
        } 
        const rolesArray = [...allowedRoles]
        console.log(req.roles)
        console.log(rolesArray)
        //map() returns array of [true, false, false, ....] , and the find then checks if there any true element it returns true, otherwise it returns false, so the result = true or false at the end
        const result = req.roles.map(role => rolesArray.includes(role)).find(u => u === true)
        if (!result) return res.status(401).send("هذا المستخدم ليس لديه الصلاحيه المطلوبه")
        next()
    }
}

module.exports = verifyRoles