const { query, checkExact } = require('express-validator');
const { getAllInvoices } = require('../models/invoiceModel');
const { getInvoiceStatusId } = require('../models/invoiceModel');

console.log(query);

exports.filterValidator = [
  query('status')
    .trim()
    .optional()
    .isIn(['draft', 'pending', 'paid'])
    .withMessage('Invalid status'),

  query('page')
    .trim()
    .optional()
    .isInt()
    .withMessage('Invalid page')
    .custom(async (value, { req }) => {
      try {
        const invoice_status_id = await getInvoiceStatusId(
          req.query.status || null
        );

        console.log(invoice_status_id);
        

        const invoices = await getAllInvoices(
          invoice_status_id,
          value,
          req.query.limit
        );

        console.log(invoices);
        

        if (!invoices || invoices.invoices.length === 0) throw new Error('Invalid page');
      } catch (err) {
        throw err;
      }
    }),

  query('limit').trim().optional().isInt().withMessage('Invalid limit'),

  checkExact([], {
    message: `Invalid filter fields`,
  }),
];
