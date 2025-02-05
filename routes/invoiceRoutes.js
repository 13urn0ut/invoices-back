const invoiceRouter = require('express').Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require('../controlers/invoiceController');
const { checkId } = require('../validators/checkId');
const {
  checkCreateInvoiceBody,
  checkUpdateInvoiceBody,
} = require('../validators/checkBody');
const { filterValidator } = require('../validators/filter');
const { validate } = require('../validators/validate');

invoiceRouter
  .route('/')
  .post(checkCreateInvoiceBody, validate, createInvoice)
  .get(filterValidator, validate, getAllInvoices);

invoiceRouter
  .route('/:id')
  .all(checkId, validate)
  //   .get(getInvoiceById)
  .patch(checkUpdateInvoiceBody, validate, updateInvoice)
  .delete(deleteInvoice);

module.exports = invoiceRouter;
