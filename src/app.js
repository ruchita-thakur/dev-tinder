const express = require("express");
const connectdb = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const validateSignupData = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId, password);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user._id }, "Mysecret@1234", {
        expiresIn: "7d",
      });
      res.cookie("token", token, { expires: new Date(Date.now() + 8 * 36000) });
      res.send("User logged in successfully");
    }
  } catch {
    res.status(500).send("Something went wrong");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("connection request sent");
  res.send(user.firstName + " is sending connection request");
});

connectdb()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(3000, () => {
      console.log("server listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Connection cannot be establised");
  });
