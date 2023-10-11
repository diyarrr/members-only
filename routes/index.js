const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require("bcryptjs")
const { validationResult } = require('express-validator');
const Message = require("../models/message");
const User = require("../models/user")
const { validateSignup } = require("../middleware/auth");

// GET index page
router.get("/", async function (req, res) {
  if (req.isAuthenticated()) {
    try {
      const messages = await Message.find().populate('user');
      const user = req.user;
      res.render("index", { user: user, messages: messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    try {
      const messages = await Message.find();
      const user = req.user;
      res.render("index", { user: user, messages: messages });
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// POST sign up form
router.post('/sign-up', validateSignup(), async (req, res) => {
  const { firstName, lastName, username, password, confirmPassword} = req.body;

  // create a data if an error occurs and fill the input places with it
  const formData = {firstName, lastName, username, password, confirmPassword}
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    res.render("sign-up", { errors: errors.array(), formData : formData });
  }
  else 
  {
    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName: firstName, lastName: lastName, username: username, password: hashedPassword });
    await newUser.save();
    res.redirect("/");
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
  }
});

// GET sign up page
router.get("/sign-up", function (req, res) {
  const formData = {}
  res.render("sign-up", {errors : [], formData : formData});
});

// GET login page
router.get("/login", function (req, res) {
  const formData = {}
  res.render("login", {error:"", formData});
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    const {username, password} = req.body
    const formData = {username, password}
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", { error: "Incorrect username or password", formData: formData });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

// Logout
router.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('/'); // Redirect the user to the home page
  });
});

module.exports = router;
