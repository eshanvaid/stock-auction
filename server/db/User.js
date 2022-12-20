const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user: String,
    stocks: String
});

module.exports = mongoose.model("users", userSchema);