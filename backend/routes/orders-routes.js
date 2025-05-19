const express = require("express");
const orderController = require('../controllers/order-controllers');
const router = express.Router();

// router.get('/',orderController.getAllOrders);
router.get('/:userid?',orderController.getAllOrders);
router.get('/:orderid',orderController.getOrderById);
router.post('/add',orderController.addNewOrder);
router.delete('/delete/:orderid',orderController.deleteOrderById);
router.put('/update/:orderid',orderController.updateOrderById);

module.exports = router;