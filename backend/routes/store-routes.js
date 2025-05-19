// const express = require("express");
// const storeController = require('../controllers/store-controllers');
// const router = express.Router();

// router.get('/',storeController.getAllStore);
// router.get('/:storeid',storeController.getStoreById);
// router.post('/add',storeController.addNewStore);
// router.put('/update/:storeid',storeController.updateStoreById);
// router.delete('/delete/:storeid',storeController.deleteStoreById);
// router.get('/getStore/:item_category', storeController.getStoresByItemCategory);

// module.exports = router;

const express = require("express");
const storeController = require('../controllers/store-controllers');
const router = express.Router();

router.get('/getNearbyStore/city/:city?',storeController.getNearbyStores);
router.get('/',storeController.getAllStore);
router.get('/:storeid',storeController.getStoreById);
router.post('/add',storeController.addNewStore);
router.put('/update/:storeid',storeController.updateStoreById);
router.delete('/delete/:storeid',storeController.deleteStoreById);
router.get('/getStore/:item_category', storeController.getStoresByItemCategory);

module.exports = router;