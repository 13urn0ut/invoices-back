const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  getInvoiceStatusId,
  updateInvoice,
  deleteInvoice,
} = require('../models/invoiceModel');
exports.createInvoice = async (req, res, next) => {
  try {
    const { amount, user_id, due_date } = req.body;

    const newInvoice = await createInvoice({
      amount,
      invoice_status_id: 1,
      user_id,
      due_date,
    });

    res.status(201).json({
      status: 'success',
      data: newInvoice,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllInvoices = async (req, res, next) => {
  try {
    const status = req.query?.status || null;

    const statusId = await getInvoiceStatusId(status);

    const invoices = await getAllInvoices(statusId);

    if (!invoices || invoices.length === 0)
      throw new AppError('Invoices not found', 404);

    res.status(200).json({
      status: 'success',
      data: invoices,
    });
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await getInvoiceById(id);

    if (!invoice) throw new AppError('Invoice not found', 404);

    res.status(200).json({
      status: 'success',
      data: invoice,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = req.body;

    const invoice_status_id = await getInvoiceStatusId(invoice.invoice_status);
    delete invoice.invoice_status;

    const updatedInvoice = await updateInvoice(id, {
      ...invoice,
      invoice_status_id,
    });

    if (!updatedInvoice) throw new AppError('Invoice not found', 404);

    res.status(200).json({
      status: 'success',
      data: updatedInvoice,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await deleteInvoice(id);

    if (!deletedInvoice) throw new AppError('Invoice not found', 404);

    res.status(200).json({
      status: 'success',
      data: deletedInvoice,
    });
  } catch (err) {
    next(err);
  }
};
