const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorString = errors
      .array()
      .map((error) => error.msg)
      .join('; ');

    next(new AppError(errorString, 400));
  }

  next();
};
