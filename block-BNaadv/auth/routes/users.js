var express = require('express');
var User = require('../models/user-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('users');
});

router.get('/register', (req, res, next) => {
  res.render('register-form');
})

router.get('/login', (req, res, next) => {

  res.render('login-form', {error : req.flash('error')[0]});
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    console.log(err, user)
    res.redirect('/users/login');
  })
})

router.post('/login', (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) {
    req.flash('error', 'Email/Password is required')
   return res.redirect('/users/login');
  }

  User.findOne({email}, (err, user) => {
    console.log(err, user)
    if(err) return next(err)
    if(!user) {
      return res.redirect('/users/login');
    }

    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      console.log(err, result)
      if(!result) {
       return   res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/');
})

module.exports = router;
