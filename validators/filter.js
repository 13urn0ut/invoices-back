const { query, checkExact, validationResult } = require('express-validator');

const filterValidator = [
  query('sort')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('Invalid sort'),

  checkExact([], {
    message: (fields) =>
      `Invalid filter fields ${fields.map((field) => field.path).join(', ')}`,
  }),
];

module.exports = filterValidator;
