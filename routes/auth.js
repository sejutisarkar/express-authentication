const express = require('express');
const passport = require('passport');
const router= express.Router();

router.get('/login/github',
  passport.authenticate('github'));

router.get('/github/return',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


  module.exports = router;
