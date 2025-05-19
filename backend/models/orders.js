const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const ordersSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    store: { type: mongoose.Types.ObjectId, required: true, ref: 'Store'},
    orders: [
        {
            item_name: { type: String, required: true},
            item_quantity: { type: Number, required: true},
            item_category: { type: String, required: true},
            item_price: {type: Number,required: true}
        }
    ],
    orderedAt:{type: Date, default:Date.now},
    address:{ type: String, required: true},
    total_amount: { type: Number},
    progress: { type: [String], default: ['Order Confirmed', 'Baking', 'Out for Delivery', 'Delivered'] },
    // Current step in the progress array
    currentStep: { type: Number, default: 0 },
    // payment_type: { type: String},

});

ordersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Orders', ordersSchema);
