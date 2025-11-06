const User = require("../Models/user");
const { signupSchema , loginSchema } = require("../SchemaValidation/user");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Validate input
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Register new user
    const newUser = new User({ username: email, email });
    await User.register(newUser, password); // Passport handles password hashing

    // Send success response
    res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, success: false });
    }

    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(409)
        .json({ message: "User not exists", success: false });
    }

    

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET_PASSWORD,
      { expiresIn: process.env.JWT_EXPIRE }
    )

    return res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};
