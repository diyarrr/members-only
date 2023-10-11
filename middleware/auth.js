
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/user');

function validateSignup() {
  return [
    body('username')
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error('Username already exists');
        }
        return true;
      }),
    body('password'),
    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
  ];
}

// Local strategy authentication
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  // User is not authenticated, redirect them to the login page or handle it as needed
  res.redirect("/login");
}

module.exports = { validateSignup, ensureAuthenticated };
