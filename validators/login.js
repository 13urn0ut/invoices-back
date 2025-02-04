const { body } = require('express-validator');
const argon2 = require('argon2');
const { getUserByEmail } = require('../models/userModel');

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email is not valid')
    .normalizeEmail(),
     // .custom(async (value) => {
     //     const user = await getUserByEmail(value);

     //     if (!user) throw new Error('User not found, please sign up');

     //     return true;
     // }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .custom(async (value, { req }) => {
      const user = await getUserByEmail(req.body.email);

      if (user) {
        const match = await argon2.verify(user.password, value);

        if (!match) throw new Error('Incorrect email or password');

        return true;
      } else {
        throw new Error('User not found, please sign up');
      }
    }),
];

module.exports = validateLogin;
