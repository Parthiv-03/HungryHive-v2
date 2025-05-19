const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

//Get user or users
router.get('/:userid?', usersController.getUsers);


//For login
router.post('/login', usersController.login);     
router.post('/create-user',usersController.createUser);
router.put('/update-user/:id',usersController.updateUser);
router.post('/sendOTP',usersController.getOTP);

module.exports = router;