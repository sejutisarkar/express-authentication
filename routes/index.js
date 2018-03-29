var express = require('express');
var router = express.Router();
const User = require('../models/user');


router.get('/profile', function(req, res, next) {
  if (! req.session.userId ) {
    var err = new Error("You are not authorized to view this page.");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteBook });
        }
      });
});
router.get('/login',(req,res) => {
  return res.render('login',{title:'Login'})
});

router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});


router.get('/register', function(req, res, next) {
  return res.render('register', { title: 'Sign Up' });
});

router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword){
      if(req.body.password !== req.body.confirmPassword){
        var err = new Error("password dont match");
        err.status = 400;
        return next(err);
      }

      //create object with form input
      const userData = {
        email: req.body.email,
        name:req.body.name,
        password:req.body.password
      };

      // use schema's create method to insert document intoo mongo
      User.create(userData, (error,user) => {
        if(error){
          return next(error);
        }else{
          req.session.userId = user._id;//once they are registered they are automatically logged in
          return res.redirect('/index');
        }
      });

    }else{
      var err = new Error("All fields required");
      err.status = 400;
      return next(err);
    }
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /
router.get('/', (req, res) => {
  return res.render('layout', { title: 'Home' });
});

router.get('/about',(req,res) => {
  return res.render('about',{title:'About'});
});

router.get('/contact',(req,res) => {
  return res.render('contact',{title:'About'});
});

module.exports = router;
