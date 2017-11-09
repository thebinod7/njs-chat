const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../utils/auth').auth;

router.get('/signup', function(req,res){
   res.render('users/signup');
});

router.get('/login', function(req,res){
   res.render('users/login');
});

router.get('/chatroom', auth, function(req,res){
   res.render('chat/room');
});

router.post('/signup',function (req,res) {
    const payload = Object.assign({}, req.body, {
    });
    const newUser = new User(payload);
    User.getByUsername(newUser.username,function (err,username) {
        if(err) throw err;
        if(username){
          req.flash('error', 'Username already exists.');
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

router.post('/login',function (req,res) {
    var user = new User({
        username : req.body.username,
        password : req.body.password
    });
    User.getByUsername(user.username, function (err, doc) {
        if(err) throw err;
        if(!doc){
            req.flash('error', 'User not registered!');
            res.redirect('/user/login');
            return;
        }
        User.comparePassword(user.password,doc.password,function (err,isMatch) {
            if(err) throw err;
            if(isMatch){
              req.session.userId = doc._id;
              req.session.user = doc;
              req.session.loggedIn = true;
              res.redirect('/user/chatroom');
            }
            else {
              req.flash('error', 'Wrong username or password!');
              res.redirect('/user/login');
            }
        });
    });
});

router.get('/logout', (req, res) => {
  req.session.userId = null;
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect('/user/login');
});

module.exports = router;
