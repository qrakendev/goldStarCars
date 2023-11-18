const mongoose = require("mongoose");

const partexModelSchema = new mongoose.Schema({
    make:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    registration_plate:{
        type: String,
        required: true
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair'],
      required: true
    },
    service_history: {
      type: String,
      enum: ['Full Service History', 
            'Partial Service History', 
            'First Service not Due', 
            'No Service History'],
      required: true,
    },
    modifications: {
      type: String,
      enum: ['No Modifications',
            'Has Modifications'],
      required: true
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

module.exports = mongoose.model("partexmodel", partexModelSchema, "partexmodel");