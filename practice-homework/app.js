const express = require("express");
const app = express();
const connectdb = require("./config/database.js");
const studentModel = require("./models/students.js");

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

// app.post("/addstudent", async (req, res) => {
//   const student = new studentModel();
//   try {
//     await student.save();
//     res.send("student added successfully");
//   } catch {
//     res.status(500).send("Error in adding student");
//   }
// });

app.use(express.json());

app.post("/addstudent", async (req, res) => {
  // console.log(req.body);
  const student = new studentModel(req.body);
  try {
    await student.save();
    res.send("student added successfully");
  } catch {
    res.status(500).send("Error saving student");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await studentModel.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch {
    res.status(500).send("error deleting user");
  }
});

connectdb().then(() => {
  console.log("connected to database successfully");
  app.listen(7777, () => {
    console.log("Server is listening on port 7777");
  });
});
