const invoiceRouter = require('express').Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require('../controlers/invoiceController');

invoiceRouter.route('/').post(createInvoice).get(getAllInvoices);
invoiceRouter
  .route('/:id')
  .get(getInvoiceById)
  .patch(updateInvoice)
  .delete(deleteInvoice);

module.exports = invoiceRouter;
