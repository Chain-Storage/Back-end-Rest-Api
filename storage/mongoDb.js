const mongoose = require("mongoose");
const dotenv = require("dotenv");

class Database {
  creatDatabase() {
    dotenv.config();
    const DB = process.env.DATABASE_LOCAL;

    mongoose
      .connect(DB, {
        useNewUrlParser: true,
      })
      .then(() => console.log("DB connection successful!"));
  }
}

module.exports = Database;
