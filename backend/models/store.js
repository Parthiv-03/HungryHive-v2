const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const storeSchema = new Schema({
    store_name: { type: String, required: true},
    description: { type: String},
    store_address: {
        house_no: { type: Number, required: true },
        street: { type: String},
        area: { type: String, required: true},
        pincode: { type: Number, required: true},
        city: { type: String, required: true},
        state: { type: String, required: true },
        country: { type: String, required: true },
    },

    menu:[
        {
            item_photo:{ type: String },
            item_name: { type: String, required: true},
            item_price: { type: Number, required: true},
            item_quantity: { type: Number, required: true},
            item_description: { type: String},
            item_type: { type: String, required: true},
            item_category: { type: String, required: true}
        }
    ],
    store_image: { type: String }

});

storeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Store', storeSchema);


