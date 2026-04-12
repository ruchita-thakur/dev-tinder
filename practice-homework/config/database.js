const mongoose = require("mongoose");

const connectdb = async () => {
  await mongoose.connect(
    "mongodb+srv://thakurruchita24_db_user:VLYkOjUJFdzOzIGY@namastenode.pqvjhud.mongodb.net/HelloWorld"
  );
};

module.exports = connectdb;
