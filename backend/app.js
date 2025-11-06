const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const userRouter = require("./Routes/user");
const taskRouter = require("./Routes/task");
const swapRoutes = require("./Routes/swap");
const User = require("./Models/user")
const cors = require("cors")
const passport = require("passport")

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODBURL;
const secret = process.env.SECRET;

const sessions = {
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};


app.use(session(sessions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.use("/", userRouter);
app.use("/tasks", taskRouter);
app.use("/swap", swapRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log("listening");
});
