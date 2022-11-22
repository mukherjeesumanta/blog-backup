const express = require('express');
const { body } = require('express-validator');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', 
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  authController.signup
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);




// Protect all routes after this middleware
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
