const { Schema, model } = require("mongoose");


module.exports.Otp = model('Otp', Schema({
    number: {
        type: String,
        required: true
    },
   

    // After 5 minutes it deleted automatically from the database
}, { timestamps: true }))