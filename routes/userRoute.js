const express = require('express')
const router = express.Router()
const userController = require('../controller/userController');
const jwtAuth = require('../jwtAuth');
const uploadMiddleware = require('../middleware/upload'); // Import your multer configuration


router.post('/signup', uploadMiddleware , userController.register);; //register in VotingApp
router.post('/login', userController.authenticate); //Login via identityCard and Password
router.put('/:userId', userController.updateUser); // User can update his password using identitycardNumber and currentPassword
router.get('/userProfiles', jwtAuth, userController.getAll); // only admin can access he can see the data of users
router.get('/profile/:userID', userController.getSingle); // User can only see his data
module.exports = router