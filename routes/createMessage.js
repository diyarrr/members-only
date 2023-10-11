
const express = require("express")
const router = express.Router()
const Message = require("../models/message")
const { ensureAuthenticated } = require("../middleware/auth")


// GET new message page
router.get("/", ensureAuthenticated, function(req, res) {
    res.render("message")
  })
  

// POST new message form
router.post("/", ensureAuthenticated, async function(req, res) {
    
    const {title, text} = req.body

    try {
        const newMessage = new Message({title: title, timestamp: new Date(), text:text, user:req.user})
        await newMessage.save();
        res.redirect("/");
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    } 
})



module.exports = router