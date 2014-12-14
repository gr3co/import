var mongoose = require('mongoose'),
User = mongoose.model('User'),
_ = require('underscore'),
passport = require('passport');

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('error', "You need to log in to do that.");
    res.redirect('/');
  } else {
    // user is authenticated!
    return next();
  }
}

function requireMobile(req, res, next) {
  if (!req.useragent.isMobile) {
    req.flash('error', "You can only view this page on mobile.");
    res.redirect('/');
  } else {
    // user is on mobile!
    return next();
  }
}

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.locals.user = req.user;
    return next();
  });

  app.get('/', function(req, res) {
    res.render('home', {
      errors: req.flash('error'),
      info: req.flash('info')
    });
  });

  app.get('/find', requireAuth, requireMobile, function(req, res) {
    res.render('find', {
      errors: req.flash('error'),
      info: req.flash('info'),
      scripts: true,
    });
  });

  app.get('/login', passport.authenticate('github'));

  app.get('/login/cb', 
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.get('/logout', requireAuth, function(req, res) {
    req.logout();
    res.redirect('/');
  });

};