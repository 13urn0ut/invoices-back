const { param } = require('express-validator');
const { getInvoiceById } = require('../models/invoiceModel');

exports.checkId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Id is required')
    .isInt()
    .withMessage('Id must be an integer')
    .custom(async (id) => {
      try {
        const invoice = await getInvoiceById(id);

        if (!invoice) throw new Error('Invoice not found');

        return true;
      } catch (err) {
        throw new Error(err);
      }
    }),
];

