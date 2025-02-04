const express = require('express');
const {
  signup,
  login,
  protect,
  authenticateUser,
  logout,
} = require('../controlers/authController');
const validateNewUser = require('../validators/signup');
const validateLogin = require('../validators/login');
const validate = require('../validators/validate');

const router = express.Router();

router.route('/signup').post(validateNewUser, validate, signup);
router.route('/login').post(validateLogin, validate, login);
router.route('/me').get(protect, authenticateUser);
router.route('/logout').get(protect, logout);

module.exports = router;
