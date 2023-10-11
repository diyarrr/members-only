

require("dotenv").config()
const express = require("express")
const router = express.Router()
const { ensureAuthenticated } = require("../middleware/auth")

const adminCode = process.env.ADMIN_CODE


// GET the create admin page
router.get("/", ensureAuthenticated, function(req, res) {
    res.render("create-admin", { error : "" })
})



// POST create admin page
router.post("/", ensureAuthenticated, async function(req, res) {

    const input = req.body.secretcode

    if(input == adminCode) 
    {
        try 
        {
            req.user.admin = true
            await req.user.save()
            res.redirect("/")

        } catch(error) {
            console.error('Error :', error);
            res.status(500).json({ error: 'Server error' });
      
        }
    }
    else 
    {
        res.render("create-admin", {error: "Wrong code"})
    }
})



module.exports = router