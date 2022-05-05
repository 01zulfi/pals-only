const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Message = require('../models/message');
const { MemberPass, AdminPass } = require('../utils/passcode-manager');

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

exports.loginGet = (req, res, next) => {
  if (req.user) return res.redirect('/');
  if (req.session.messages) {
    const latestMessage = req.session.messages[req.session.messages.length - 1];
    req.session.messages = [];
    return res.render('login-form', {
      error: latestMessage,
    });
  }
  return res.render('login-form');
};

exports.loginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureMessage: true,
});

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};

exports.userDetail = (req, res, next) => {
  async.parallel(
    {
      user: (callback) => {
        User.findById(req.params.id).exec(callback);
      },
      userMessages: (callback) => {
        Message.find({ author: req.params.id }).exec(callback);
      },
    },
    (err, result) => {
      if (err) return next(err);
      return res.render('user-detail', {
        title: `${result.user.username}`,
        user: result.user,
        userMessages: result.userMessages,
      });
    },
  );
};

exports.memberGet = (req, res, next) => {
  res.render('member-form', { title: 'Become a Member | Pals Only' });
  return res.end();
};

exports.memberPost = [
  body('passcode', 'Incorrect Passcode')
    .trim()
    .escape()
    .custom((value) => MemberPass.check(value)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('member-form', {
        title: 'Become a Member | Pals Only',
        errors: errors.array(),
      });
    }
    return User.findByIdAndUpdate(
      req.user._id,
      { isMember: true },
      {},
      (err) => {
        if (err) return next(err);
        return res.redirect('/');
      },
    );
  },
];

exports.adminGet = (req, res, next) => {
  res.render('admin-form', { title: 'Become an Admin | Pals Only' });
  return res.end();
};

exports.adminPost = [
  body('passcode', 'Incorrect Passcode')
    .trim()
    .escape()
    .custom((value) => AdminPass.check(value)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin-form', {
        title: 'Become an Admin  | Pals Only',
        errors: errors.array(),
      });
    }
    return User.findByIdAndUpdate(
      req.user._id,
      { isAdmin: true },
      {},
      (err) => {
        if (err) return next(err);
        return res.redirect('/');
      },
    );
  },
];
