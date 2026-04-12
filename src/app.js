const express = require("express");
const connectdb = require("./config/database.js");
const app = express();
const User = require("./models/user.js");
const validateSignupData = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //Creating a new instance of user model
  // const user = new User({
  //   firstName: "Ruchita",
  //   lastName: "Thakur",
  //   emailId: "ruchita.thakur@gmail.com",
  //   password: "ruchita@1234",
  //   age: 27,
  //   gender: "Female",
  // });
  // const user = new User(req.body);
  try {
    validateSignupData(req);
    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    req.body.password = passwordHash;
    const user = new User(req.body);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }

  // try {
  //   await user.save();
  //   res.send("User added successfully");
  // } catch (err) {
  //   res.status(500).send("Error in saving user" + err.message);
  // }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //Create a JWT token
      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$24");
      //Add the token to cookie and send it in the response to the user
      res.cookie("token", token);
      res.send("Login Successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("ERROR:" + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "Dev@Tinder$24");

    const { _id } = decodedMessage;

    const user = await User.findById({ _id: _id });

    res.send(user);
  } catch (err) {
    res.status(500).send("ERROR:" + err.message);
  }
});

app.get("/users", async (req, res) => {
  // const userFirstName = req.body.firstName;
  try {
    const users = await User.findOne({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch {
    res.status(500).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { ...updates } = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "skills", "photoUrl", "about"];

    const isUpdateAllowed = Object.keys(updates).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (updates.skills && updates.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { returnDocument: "before", runValidators: true },
    );
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Update failed " + err.message);
  }
});

// app.patch("/user", async (req, res) => {
//   try {
//     const { userId, ...updates } = req.body;

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: updates },
//       {
//         new: true, // return updated document
//         runValidators: true, // enforce schema rules
//       }
//     );

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.send({
//       message: "User updated successfully",
//       user,
//     });
//   } catch (err) {
//     res.status(500).send("Update failed: " + err.message);
//   }
// });

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
