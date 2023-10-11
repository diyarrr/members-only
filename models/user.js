const mongoose = require("mongoose")


const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName : {type:String, required:true},
    lastName :   {type:String, required:true},
    username :  {type:String, required:true, unique:true},
    password :  {type:String, required:true},
    isMember :  {type:Boolean, default:false},
    admin    :  {type:Boolean, default:false}
})


const User = mongoose.model("User", UserSchema)


module.exports = User