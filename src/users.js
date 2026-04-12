const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth.js");

app.use("/admin", adminAuth);

app.get("/admin", (req, res) => {
  res.send("All users data sent successfully");
});

app.use("/users", userAuth, (req, res) => {
  res.send("user data sent successfully");
});

app.listen(8000, () => {
  console.log("server listing on port 8000");
});
