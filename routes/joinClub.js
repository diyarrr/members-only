
require("dotenv").config()
const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../middleware/auth")

const CORRECT_PASSCODE = process.env.PASSCODE

// GET join club passcode form page
router.get("/", ensureAuthenticated, function(req, res) {
    res.render("join-club", {error:""})
  })
  
// POST passcode form
router.post("/", ensureAuthenticated, async function(req, res) {
    const passcode = req.body.passcode
  
    // Checks if the passcode is correct
    if(passcode == CORRECT_PASSCODE) 
    {
      try {
  
        // Change user's member status
        req.user.isMember = true
        await req.user.save()
        res.redirect("/")
  
      } catch(error) {
        console.error('Error :', error);
        res.status(500).json({ error: 'Server error' });
  
      }
  
    }
    else 
    {
      res.render("join-club", {error: "Wrong passcode"})
    }
  
  })

module.exports = router