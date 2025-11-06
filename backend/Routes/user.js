const express = require("express");
const { signup, login } = require("../Controller/user");
const verifyToken = require("../Middleware/user");
const router = express.Router();

router.post("/signup", signup);

router.post("/login" , login);

// Protected routes
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

module.exports = router;