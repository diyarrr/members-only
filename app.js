// app.js
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport");
const session = require("express-session");
const indexRoutes = require("./routes/index")
const messageRoutes = require("./routes/createMessage")
const joinClubRoutes = require("./routes/joinClub")
const createAdminRoutes = require("./routes/createAdmin")
const deleteMessageRoutes = require("./routes/deleteMessages")


const dbUrl = process.env.DATABASE_URL


// Connect to your MongoDB database
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a mongoose connection
const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const app = express()
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use(session({secret: "cats", resave: false, saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session())
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data


app.use('/', indexRoutes);
app.use('/create-message', messageRoutes);
app.use('/join-club', joinClubRoutes);
app.use("/create-admin", createAdminRoutes)
app.use("/delete-message", deleteMessageRoutes)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})