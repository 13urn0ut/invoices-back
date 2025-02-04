const { body, checkExact } = require('express-validator');
const { getUserByEmail } = require('../models/userModel');

const validateNewUser = [
  // check if body is not empty
  body().notEmpty().withMessage('User body must contain data'),

  // check if email is valid
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid')
    .normalizeEmail()
    .custom(async (value) => {
      const user = await getUserByEmail(value);

      if (user) throw new Error('Email already in use');

      return true;
    }),

  // check firstName
  body('firstName').trim().notEmpty().withMessage('First name is required'),

  // check lastName
  body('lastName').trim().notEmpty().withMessage('Last name is required'),

  // check password
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom((value, { req }) => {
      if (value !== req.body.passwordconfirm) {
        throw new Error('Password does not match password confirm');
      }

      return true;
    }),

  // check password confirm
  body('passwordconfirm')
    .trim()
    .notEmpty()
    .withMessage('Password confirm is required'),

  checkExact([], { message: 'Invalid fields' }),
];

module.exports = validateNewUser;
