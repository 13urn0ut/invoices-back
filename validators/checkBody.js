const { body, checkExact } = require('express-validator');
const { getUserById } = require('../models/userModel');
const { getInvoiceStatusId } = require('../models/invoiceModel');

exports.checkCreateInvoiceBody = [
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Amount is required')
    .isCurrency({ allow_negatives: false, digits_after_decimal: [0, 1, 2] })
    .withMessage('Amount is not valid'),

  body('user_id')
    .trim()
    .notEmpty()
    .withMessage('User id is required')
    .isInt()
    .withMessage('User id is not valid')
    .custom(async (value) => {
      try {
        const user = await getUserById(value);

        if (!user) throw new Error('User not found');

        return true;
      } catch (err) {
        throw new Error(err);
      }
    }),

  body('due_date').trim().notEmpty().withMessage('Due date is required'),

  checkExact([], { message: 'Invalid fields' }),
];

exports.checkUpdateInvoiceBody = [
  body('amount')
    .trim()
    .optional()
    .isCurrency({ allow_negatives: false, digits_after_decimal: [0, 1, 2] })
    .withMessage('Amount is not valid'),

  body('user_id')
    .trim()
    .optional()
    .isInt()
    .withMessage('User id is not valid')
    .custom(async (value) => {
      try {
        const user = await getUserById(value);

        if (!user) throw new Error('User not found');

        return true;
      } catch (err) {
        throw new Error(err);
      }
    }),

  body('due_date').trim().optional(),

  body('invoice_status')
    .trim()
    .optional()
    .isIn(['draft', 'pending', 'paid'])
    .withMessage('Invoice status is not valid')
    .custom(async (value) => {
      try {
        const invoiceStatusId = await getInvoiceStatusId(value);

        if (!invoiceStatusId) throw new Error('Invoice status not found');

        return true;
      } catch (err) {
        throw new Error(err);
      }
    }),

  checkExact([], { message: 'Invalid fields' }),
];
