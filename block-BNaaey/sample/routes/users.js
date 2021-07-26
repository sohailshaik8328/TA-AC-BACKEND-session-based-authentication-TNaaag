var express = require('express');
var User = require('../models/user-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  
  res.render('users');
});

router.get('/register', (req, res, next) => {
  res.render('register-form');
});

router.get('/login', (req, res, next) => {
  res.render('login-form');
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(err, user);
    res.redirect('login-form')
  })
})

router.post('/login', (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    return res.redirect('/users/login');
  }

  User.findOne({email}, (err, user) => {
    if(err) return next(err);

    if(!user) {
      return res.redirect('/users/login')
    }

    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
       return res.redirect('/users/login');
      }
      
      req.session.userId = user.id;
      res.redirect('/users')

    })
  })
})


module.exports = router;
