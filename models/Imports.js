const mongoose = require("mongoose");

const importsModelSchema = new mongoose.Schema({
    make:{
        type: String,
        required: false
    },
    model:{
        type: String,
        required: false
    },
    mileage: {
      type: Number,
      required: false
    },
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
    }
  });

module.exports = mongoose.model("importsmodel", importsModelSchema, "importsmodel");