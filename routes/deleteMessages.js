
const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../middleware/auth")
const Message = require("../models/message")


// DELETE the specific message from the database with admin request
router.get("/:id", ensureAuthenticated, async function(req, res) {

    try 
    {
        const messageId = req.params.id
        // I do not need to check if the user is admin because I show trash icon only the admins
        await Message.findByIdAndRemove(messageId)
        res.redirect("/")
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
      }

})


module.exports = router