const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const objectId = mongoose.Schema.ObjectId;
const userSchema = mongoose.Schema({
    userId : objectId,
    fullname : {
        type : String
    },
    username : {
        type : String
    },
    password : {
        type : String
    },
    isActive : {
        type : Boolean,
        default : true
    },
    dateAdded : {
        type : Date,
        default: Date.now
    }
});

const User = module.exports = mongoose.model('User',userSchema);

module.exports.getByUsername = function (username, callback) {
    const query = {username : username}
    User.findOne(query,callback);
}

module.exports.addUser = function (newUser,callback) {
  console.log(newUser)
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          console.log(err);
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function (candidatePassword,hash,callback) {
    bcrypt.compare(candidatePassword,hash,function (err,isMatch) {
        if(err) throw err;
        callback(null,isMatch);
    });
}
