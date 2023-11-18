const mongoose = require("mongoose");

const contactModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    }
  });

module.exports = mongoose.model("contactmodel", contactModelSchema, "contactmodel");