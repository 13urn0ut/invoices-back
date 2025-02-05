const { query, checkExact } = require('express-validator');

exports.filterValidator = [
  query('status')
    .trim()
    .optional()
    .isIn(['draft', 'pending', 'paid'])
    .withMessage('Invalid status'),

  checkExact([], {
    message: (fields) =>
      `Invalid filter fields ${fields.map((field) => field.path).join(', ')}`,
  }),
];
