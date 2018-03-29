const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const logger = require('morgan');
const routes = require('./routes/index');
const auth = require('./routes/auth');
const MongoStore = require('connect-mongo')(session);//access the sesssion
const app = express();

//var connect = require('connect');
//var MongoStore = require('connect-mongostore')(connect);
function generateOrFindUser(accessToken, refreshToken, profile, done){
  if(profile.emails[0]){
    User.findOneAndUpdate(
      {email: profile.emails[0]},
      {
        name:profile.displayName || profile.username,
        email:profile.emails[0].value,
        photo:profile.photos[0].value
      },
      {
        upsert:true
      },
      done
    );
  }else{
    var noEmailError = new Error("your email privacy settings prevent you from signing into BookLovers");
    done(noEmailError);
  }
}
passport.use(new GitHubStrategy ({
  clientID:'1bdc7a600e0f44cc1ad5',
  clientSecret: '344a3f7bc5e0d5c84f80a90062673d589ec3d58d',
  callbackURL: 'http://localhost:3000/auth/github/return'
  },
  generateOrFindUser)
);

passport.serializeUser((user,done)=>{
   done(null,user_.id);
 });
passport.deserializeUser((userId,done)=>{
   User.findById(userId,(err,done)=>{
   });
});
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
app.use('/', routes);
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
