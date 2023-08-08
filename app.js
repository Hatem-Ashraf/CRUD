require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override') ;
const session = require('express-session');
const connectDB = require('./server/config/db.js');
const app = express();
const port = process.env.PORT || 3000;
const courseRoutes = require('./server/routes/courses.js');
const stuContRouter = require('./server/routes/studentControl.js'); 

//--------
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const verifyJWT = require('./server/middleware/verifyJWT')
const path = require('path')

app.use(methodOverride('_method'));
// app.use(logger)


app.use(cookieParser())

// Connect to the database
connectDB();

// Template engine 
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//helps use to grab the data from the form in api
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

// Static files
app.use(express.static('public'));

//flash messages  and express session
const flash = require('connect-flash');
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //one week
    },
  })
);
app.use(flash());

// Routes


// ------------ some routes for login -------------
app.get('/', (req, res) => {
  res.render('base1', { title: "login system" })
})
app.get('/control', (req, res) => {
  res.render('control', { title: "login system" })
})
app.get('/personnel', (req, res) => {
  res.render('personnel', { title: "login system" })
})
app.get('/student', (req, res) => {
  res.render('student', { title: "login system" })
})


//user's auth route
app.use('/auth', require("./server/routes/login/auth"))


//--routes need permissions
app.use(verifyJWT)
app.use('/', require('./server/routes/customers'));

app.use('/', courseRoutes);
app.use('/', stuContRouter);



//route for the studentResult controlller, in order to create its score
app.use('/stuResult', require('./server/routes/stuResult'))
//routes for creating email for each student
app.use('/registers', require('./server/routes/login/registers'))


//routes used to go to the users dashboard like control login, editor login,...
app.use('/usersdash', require("./server/routes/login/usersDash"))

//logout route
app.use('/logout', require("./server/routes/login/logout"))



//route for the student homepage
app.use('/onestudent', require('./server/routes/login/oneStudent'))

// ---------------- end of routes for login -------------------------


// Handle 404 error page not found 
app.get('*', (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});


/*userName: university 
pass: 5Y29bVRLAiHmxI9z */