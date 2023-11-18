const mongoose = require("mongoose");

const gasModelSchema = new mongoose.Schema({
    imagePath: { type: [String], required: false },
    title: { type: String, required: false },
    t1: { type: String, required: false },
    t2: { type: String, required: false },
    year: { type: Number, required: false },
    price: { type: Number, required: false },
    priceStr: { type: String, required: false },
    topspeed: { type: String, required: false },
    time60: { type: String, required: false },
    mileage: { type: Number, required: false },
    totalMiles: {type: Number, required: false},
    fuel: {type: String, required: false},
    isElectric: {type: Boolean, defualt: false,required: false},
    range: {type: String, require: false},
    engine: { type: Number, required: false },
    cyl: { type: Number, required: false },
    gearbox: { type: String, required: false },
    transmission: { type: String, required: false },
    colour: { type: String, required: false },
    interior: { type: String, required: false },
    body: { type: String, required: false },
    drivetrain: { type: String, required: false },
    wheel: { type: String, required: false },
    description: { type: String, required: false },
});

module.exports = mongoose.model("gasmodel", gasModelSchema, "gasmodel");
