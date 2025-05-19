const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Order = require('../models/orders');

const getAllOrders = async (req,res,next)=>{

    const userid = req.params.userid;
    let orders;
    if(!userid){
        try {
            orders = await Order.find({}).lean();
        } catch (err) {
            const error = new HttpError(
            'Fetching ordre failed, please try again later.',
            500
        );
        return next(error);
    }
        res.json({orders});
}
    else{
        try {
            orders = await Order.find({user: userid}).lean();
        } catch (err) {
            const error = new HttpError(
                'Fetching ordre failed, please try again later.',
                500
            );
            return next(error);
        }
        
        res.json({orders});
    }
    
}

const getOrderById = async (req,res,next)=>{
        let orderid = req.params.orderid;
        let order;
        try {
            order = await Order.findById(orderid);
        } catch (err) {
            const error = new HttpError(
                'Fetching ordre failed, please try again later.',
                500
            );
            return next(error);
        }
        res.json({order: order.toObject()});
}

const addNewOrder =  async (req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { userid,storeid,orders,address,total_amount,progress,currentStep } = req.body;
    const createdOrder = new Order({
        user: new mongoose.Types.ObjectId(userid),
        store: new mongoose.Types.ObjectId(storeid),
        orders: orders,
        address: address,
        total_amount :total_amount,
        progress: progress,
        currentStep: currentStep,
    });
    try {
        await createdOrder.save();
    } catch (err) {
        const error = new HttpError(
            'Adding  order failed, please try again later.',
            500
        );
        return next(error);
    }
    
    res.status(201).json({ order: createdOrder.toObject({ getters: true }) });

}


const deleteOrderById = async (req,res,next)=>{
    const orderid = req.params.orderid;
    let order;
    try {
        order = await Order.findByIdAndDelete(orderid);
    } catch (err) {
        const error = new HttpError(
            'Deleting  order failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({message: "deleting done"});
}

const updateOrderById = async (req,res,next) => {
    const orderid = req.params.orderid;
    const { orders } = req.body;
    let updatedOrder;
    try {
        updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                orders: orders, 
            },
            { new: true, runValidators: true }
        );
    } catch (err) {
        const error = new HttpError('Updating order failed, please try again later.', 500);
        return next(error);
    }
    if (!updatedOrder) {
        const error = new HttpError('Could not find an order for the provided ID.', 404);
        return next(error);
    }
    res.status(200).json({ order: updatedOrder.toObject({ getters: true }) });
}

exports.getAllOrders = getAllOrders;
exports.getOrderById = getOrderById;
exports.addNewOrder = addNewOrder;
exports.deleteOrderById = deleteOrderById;
exports.updateOrderById = updateOrderById;