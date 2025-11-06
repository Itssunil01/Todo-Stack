const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: false 
  },
  
  email: {
    type: String,
    required: true, //fixed typo: was "require"
    unique: true,
  },
});

//passport-local-mongoose automatically adds username + password hash + salt
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
