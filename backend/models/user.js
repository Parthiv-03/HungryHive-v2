const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    phone_number: {type: Number, length: 10},
    address: {
        house_no: { type: Number},
        street: { type: String},
        area: { type: String},
        pincode: { type: Number, length:6},
        city: { type: String},
        state: { type: String},
        country: { type: String},
    },
});


module.exports = mongoose.model('User', userSchema);


