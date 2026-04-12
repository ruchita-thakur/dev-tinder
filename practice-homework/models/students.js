const mongoose = require("mongoose");

const student = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  rollNo: { type: Number },
});

module.exports = mongoose.model("students", student);
