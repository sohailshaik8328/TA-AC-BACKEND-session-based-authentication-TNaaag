var express = require('express');
var User = require('../models/user-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  
  res.render('users');
});

router.get('/register', (req, res, next) => {
  console.log(req.flash('emailError'))
  console.log(req.flash('passwordError'))
  res.render('register-form');
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login-form', {error});
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(err, user);

    if(!user.email.includes('@')) {
      req.flash('emailError', 'email must contain @')
      res.redirect('/users/register')
    } else if (user.password.length < 4) {
      req.flash('passwordError', 'password must contain more than 4 characters');
      res.redirect('/users/register')
    }else {
      res.redirect('/users/login')
    }
  })
})

router.post('/login', (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    req.flash('error', 'Email/Password Required');
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
