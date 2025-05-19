const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Cart = require('../models/cart');


const getAllCart = async (req,res,next)=>{

    const userid = req.params.userid;
    let carts;
    if(!userid){
        try {
            carts = await Cart.find({});
        } catch (err) {
            const error = new HttpError(
            'Fetching Cart failed, please try again later.',
            500
        );
        return next(error);
    }
        res.json({carts: carts.map(cart => cart.toObject({ getters: true }))});
    }
    else{
        try {
            carts = await Cart.find({user: userid});
        } catch (err) {
            const error = new HttpError(
                'Fetching Cart failed, please try again later.',
                500
            );
            return next(error);
        }
        res.json({ carts: carts.map(cart => cart.toObject({ getters: true }))});

    }
    
}

const getCartById = async (req,res,next)=>{
    let cartid = req.params.cartid;
    let cart;
    try {
        cart = await Cart.findById(cartid);
    } catch (err) {
        const error = new HttpError(
            'Fetching Cart failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({cart: cart.toObject()});
}


const addNewCart =  async (req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { userid , items,total_amount } = req.body;
    const createdCart = new Cart({
        user: new mongoose.Types.ObjectId(userid),
        items: items,
        total_amount: total_amount,
    });
    try {
        await createdCart.save();
    } catch (err) {
        const error = new HttpError(
            'Adding Cart failed, please try again later.',
            500
        );
        return next(error);
    }
    res.status(201).json({ cart: createdCart.toObject({ getters: true }) });

}

const deleteCartById = async (req,res,next)=>{
    const cartid = req.params.cartid;
    let cart;
    try {
        cart = await Cart.findByIdAndDelete(cartid);
    } catch (err) {
        const error = new HttpError(
            'Deleting  Cart failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({message: "deleting done"});
}

const updateCartById = async (req,res,next) => {
    const cartid = req.params.cartid;
    const { items, totalAmount } = req.body;
    let updatedCart;
    try {
        updatedCart = await Cart.findByIdAndUpdate(
            cartid,
            {
                items: items, 
                total_amount: totalAmount
            },
            { new: true, runValidators: true }
        );
    } catch (err) {
        const error = new HttpError('Updating Cart failed, please try again later.', 500);
        return next(error);
    }
    if (!updatedCart) {
        const error = new HttpError('Could not find an Cart for the provided ID.', 404);
        return next(error);
    }
    res.status(200).json({cart: updatedCart.toObject({ getters: true }) });
}


exports.getAllCart = getAllCart;
exports.getCartById = getCartById;
exports.addNewCart = addNewCart;
exports.deleteCartById = deleteCartById;
exports.updateCartById = updateCartById;