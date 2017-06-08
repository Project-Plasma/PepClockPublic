const express = require('express');
const sprintfjs = require('sprintf-js');
const base32 = require('thirty-two');
const crypto = require('crypto');
const middleware = require('../middleware');

const router = express.Router();

router.route('/')
  .get(middleware.auth.render);

router.route('/create')
  .get(middleware.auth.verify, middleware.auth.render);

router.route('/dashboard')
  .get(middleware.auth.verify, middleware.auth.render);

router.route('/edit/:id')
  .get(middleware.auth.verify, middleware.auth.render);

router.route('/events/:id')
  .get(middleware.auth.verify, middleware.auth.updateAndRender);

router.route('/redirected')
  .get(middleware.auth.render);

router.route('/login')
  .get((req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  })
  .post(middleware.passport.authenticate('local-login', { 
    failureRedirect: '/login',
    failureFlash: true
  }), middleware.auth.twoFactor);  //was middleware.auth.redirect

router.route('/signup')
  .get((req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  })
  .post(middleware.passport.authenticate('local-signup', {
    failureRedirect: '/signup',
    failureFlash: true
  }), middleware.auth.twoFactor);  //was middleware.auth.redirect

router.route('/profile')
  .get(middleware.auth.verify, (req, res) => {
    res.render('profile.ejs', {
      user: req.user
    });
  });

router.route('/logout')
  .get((req, res) => {
    req.logout();
    res.redirect('/');
  });

router.get('/auth/google', middleware.passport.authenticate('google', {
  scope: ['email', 'profile']
}));

router.get('/auth/google/callback', 
  middleware.passport.authenticate('google', 
  { failureRedirect: '/login' }), 
  middleware.auth.redirect);

router.get('/auth/facebook', middleware.passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

router.get('/auth/facebook/callback', 
  middleware.passport.authenticate('facebook', 
  { failureRedirect: '/login' }), 
  middleware.auth.redirect);

router.get('/auth/twitter', middleware.passport.authenticate('twitter'));

router.get('/auth/twitter/callback', middleware.passport.authenticate('twitter', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.get('/noTwoFA', function(req, res) {
  req.session.method = 'plain';
  req.session.secret = undefined;
  req.user.twoFactorEnabled = 0;
  res.redirect('/dashboard');
});   //dashboard

router.get('/yesTwoFA', function(req, res) {
  req.session.method = 'totp';
  res.redirect('/totp-setup')
});

router.get('/totp-setup', function(req, res) {
  if (!req.user || !req.user.email) {
    console.log('User or email missing')
    res.redirect('/login');
  }
  req.session.key = base32.encode(crypto.randomBytes(16)).toString().replace(/=/g, '');
  let url = null;
  // if (req.user.email !== undefined) {
  //   req.session.qrData = sprintfjs('otpauth://totp/%s?secret=%s', req.user.first, req.session.key)
  //   req.session.url = "https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=" + qrData;

  res.redirect('/totp-input')
    // res.redirect('/totp-input', {
    //   user: req.user,
    //   session: req.sesison,
    //   qrUrl: url
    // });
  });

router.get('/totp-input', middleware.auth.verify, function(req, res) {
  console.log('We are HERE!!!');
  console.log(req.session)
    if(!req.session.key) {
        console.log("Logic error, totp-input requested with no key set");
        res.redirect('/login');
    }
    
    res.render('totpinput.ejs');
});

// router.post('/totpinput', middleware.auth.verify, middleware.passport.authenticate('twofa', {
//   failureRedirect: '/login',
//   successRedirect: '/totp-setup'
// }));


// router.post('/totpsetup', middleware.auth.verify, function(req, res) {
//   console.log(req.user, 'user from router.post/totpsetup');
// })



module.exports = router;
