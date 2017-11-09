const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/signup', function(req,res){
   res.render('users/signup');
});

router.get('/login', function(req,res){
   res.render('users/login');
});

router.get('/chatroom', function(req,res){
   res.render('chat/room');
});

router.post('/signup',function (req,res) {
    const payload = Object.assign({}, req.body, {
    });
    const newUser = new User(payload);
    User.getByUsername(newUser.username,function (err,username) {
        if(err) throw err;
        if(username){
          req.flash('error', 'Username already exits.');
          res.redirect('/user/signup');
          return;
        }
        else {
            User.addUser(newUser,function (err,doc) {
                if(err){
                  req.flash('error', 'Server error! Please try again');
                  res.redirect('/users/signup');
                } else {
                    req.flash('success', 'Your account has been created successfully. Please login to continue!');
                    res.redirect('/user/login');
                }
            })
        }
    });
});

module.exports = router;
