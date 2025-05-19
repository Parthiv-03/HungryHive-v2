const express = require("express");
const cartController = require('../controllers/cart-controllers');
const router = express.Router();

router.get('/:userid?',cartController.getAllCart);
router.get('/:cartid',cartController.getCartById);
router.post('/add',cartController.addNewCart);
router.delete('/delete/:cartid',cartController.deleteCartById);
router.put('/update/:cartid',cartController.updateCartById);

module.exports = router;