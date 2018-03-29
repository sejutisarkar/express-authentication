const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
//load the User model
const User = require('../models/user');


module.exports = function(passport){
  passport.serializeUser((user,done)=>{
    done(null,user._id);
  });
  passport.deserializeUser((userId,done) =>{
    User.findById(userId,(err,done)=>{
      done(err,user);
    });
  });

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
  passport.use(new FacebookStrategy ({
        'clientID'        : '1710079272392762', // your App ID
        'clientSecret'    : 'f3b9d995528033c522e093288acf5bc4', // your App Secret
        'callbackURL'     : 'http://localhost:3000/login/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },
    generateOrFindUser)
  );
}
