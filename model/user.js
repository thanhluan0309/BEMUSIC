const { verify } = require("argon2");
const mongoose = require("mongoose");
const { DateTime, Date } = require("mssql");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
dotenv.config();
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  account_image: {
    type: String,
  },
  roles: {
    type: String,
    enum: [process.env.ADMIN, process.env.USER],
    default: process.env.USER,
  },
});
module.exports = mongoose.model("users", UserSchema);
