var express = require('express');
var User = require('../models/user-model');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  
  res.render('users');
});

router.get('/register', (req, res, next) => {
  console.log(req.flash('error'));
  res.render('register-form', {error : req.flash('error')[0]});
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('login-form', {error});
})

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    // if(err) return next(err);
    if(err) {
      if(err.name === 'MongoError') {
        req.flash('error', 'Email is already existed');
        return res.redirect('/users/register');
      }

      if(err.name == 'valiationError') {
        req.flash('error', err.message);
        return res.redirect('users/register')
      }
      
      return res.json({err})
    }

    res.redirect('/users/login')

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
      req.flash('error', 'Email is not registered');
      return res.redirect('/users/login')
    }

    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result) {
        req.flash('error', 'password is wrong')
       return res.redirect('/users/login');
      }
      
      req.session.userId = user.id;
      res.redirect('/users')

    })
  })
})


router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/')
})

module.exports = router;
