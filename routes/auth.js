const express = require('express');
const passport = require('passport');
const router= express.Router();

router.get('/login/facebook',
  passport.authenticate('facebook',{scope:["email"]}));

router.get('/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
module.exports = router;
