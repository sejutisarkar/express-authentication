const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const UserSchema = new mongoose.Schema({
  email: {
    type:String,
    unique:true,
    required:true,
    trim :true
  },
  name: {
    type:String,
    required:true,
    trim :true
  },
  password: {
    type:String,
    required:true,
  },

});
//authenticate
UserSchema.statics.authenticate = function(email,password,callback){
  this.findOne({email:email},function(error,user){
    if(error){
      return callback(error);
    }else if(!user){
      var error = new Error("user does not exist");
      error.status = 401;
      return callback(error);
    }
    bcrypt.compare(password,user.password,function(error,result){
      if(result===true){
        return callback(null,user);
      }else{
        return callback();
      }
    })
  })
}
//runs just befor saving the datas into mongo(presave hook function)
//hash the password
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, salt, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});
var User = mongoose.model('User', UserSchema);
module.exports = User;
