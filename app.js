const express = require('express');
var port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const MongoStore = require('connect-mongo')(session);//access the sesssion
const app = express();
require('./config/passport')(passport);

//parse request
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());


mongoose.connect('mongodb://localhost:27017/book');
var db = mongoose.connection;

//mongo Error
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
  console.log("yeah!!");
});

//session
app.use(session({
  secret:"jesus!!!",
  resave:true,
  store: new MongoStore({
    mongooseConnection: db
  }),
  saveUninitialized:false
}));
//initialize passport
app.use(passport.initialize());
// //restore sesssion
app.use(passport.session());

/// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});
// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
const routes = require('./routes/index');
app.use('/', routes);
const auth = require('./routes/auth');
app.use('/auth',auth);

//catch 404 and forward to error handler
app.use((req, res, next)=> {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(3000, () =>{
  console.log('Express app listening on port 3000');
});
