const express = require("express");
const authRouter = express.Router();
const validateSignupData = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId, password);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Password is invalid");
    }

    const token = await user.getJWT();
    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 36000) });
    res.send("User logged in successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful");
});

module.exports = { authRouter };
