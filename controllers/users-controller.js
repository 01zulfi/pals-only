const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      return bcrypt.compare(password, user.password, (error, res) => {
        if (err) return done(err);
        if (res) return done(null, user);
        return done(null, false, { message: 'Incorrect password' });
      });
    });
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

exports.signupGet = (req, res, next) => {
  if (req.user) return res.redirect('/');
  return res.render('signup-form');
};
