//npm modules "those created by developers"
const {format} = require('date-fns')
const {v4: uuid} = require("uuid") //now i can use version 4 of uuid as a uuid object

//core node modules "those are owned by node.js"
const fs = require("fs")
const fsPromises = require("fs").promises
const path = require("path")

const logEvents = async(message, fileName) =>{
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)

    try{
        if(!fs.existsSync(path.join(__dirname, "..", "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs" , fileName), logItem)
    } catch (err) { 
        console.error(err)
    }   
}   

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt")
    console.log(`${req.method}\t${req.path}`)
    //next is used to make the request continued to another middlewares
    next()
}
module.exports = { logger, logEvents }