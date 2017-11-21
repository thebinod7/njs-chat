const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
   res.render('index');
});

router.get('/home', function(req,res){
   res.render('home');
});

router.get('/test', function(req,res){
   res.render('test');
});

router.get('/chat-test', function(req,res){
   res.render('chatTest');
});



module.exports = router;
