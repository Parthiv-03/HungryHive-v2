const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const cartSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    items: [
        {
            store: { type: mongoose.Types.ObjectId, required: true, ref: 'Store'},
            item_name: { type: String, required: true},
            item_quantity: { type: Number, required: true},
            item_price: {type:Number,required: true},
            item_category: { type: String, required: true}
        }
    ],
    total_amount: {type: String},
});

cartSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Cart', cartSchema);