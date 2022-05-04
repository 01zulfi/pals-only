const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
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

exports.signupPost = [
  body('username', 'Username must not be empty').trim().notEmpty().escape(),
  body('password', 'Password must not be empty').trim().notEmpty().escape(),
  body('confirmPassword', 'Password must match with confirm password field')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password),
  body('firstName').trim().escape(),
  body('lastName').trim().escape(),
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) return next(err);
      const errors = validationResult(req);

      const user = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
      });

      if (!errors.isEmpty()) {
        return res.render('signup-form', {
          ...user,
          errors: errors.array(),
        });
      }

      return user.save((error) => {
        if (error) {
          return next(error);
        }
        return res.redirect('/');
      });
    });
  },
];
