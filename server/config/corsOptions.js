const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            //if the origin is in the white list, !origin means undefined 'that caused by the localhost:3500 domain itself so it should be allowed'
            callback(null, true) //null means no errors , true means it is allowed
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionSuccessStatus: 200
}

module.exports = corsOptions