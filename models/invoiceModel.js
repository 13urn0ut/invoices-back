const e = require('express');
const { sql } = require('../dbConnection');

exports.createInvoice = async (invoice) => {
  const [newInvoice] = await sql`
        INSERT INTO invoices ${sql(
          invoice,
          'amount',
          'invoice_status_id',
          'user_id',
          'due_date'
        )}
        RETURNING invoices.*;
    `;

  return newInvoice;
};

exports.getAllInvoices = async (statusId) => {
  const invoices = await sql`
        SELECT invoices.*, invoice_statuses.status
        FROM invoices
        JOIN invoice_statuses
        ON invoice_statuses.id = invoices.invoice_status_id
        ${statusId ? sql`WHERE invoice_status_id = ${statusId}` : sql``}
    `;

  return invoices;
};

exports.getInvoiceById = async (id) => {
  const [invoice] = await sql`
        SELECT invoices.*
        FROM invoices
        WHERE invoices.id = ${id}
    `;

  return invoice;
};

exports.updateInvoice = async (id, invoice) => {
  console.log(invoice);

  const [updatedInvoice] = await sql`
        UPDATE invoices
        SET ${sql(invoice)}
        WHERE id = ${id}
        RETURNING *
    `;

  return updatedInvoice;
};

exports.deleteInvoice = async (id) => {
  const [deletedInvoice] = await sql`
        DELETE FROM invoices
        WHERE id = ${id}
        RETURNING *
    `;

  return deletedInvoice;
};

exports.getInvoiceByUserId = async (id) => {
  const [invoice] = await sql`
        SELECT invoices.*
        FROM invoices
        WHERE invoices.user_id = ${id}
    `;

  return invoice;
};

exports.getInvoiceStatusId = async (status) => {
  const [invoiceStatusId] = await sql`
        SELECT id
        FROM invoice_statuses
        WHERE status = ${status}    
  `;

  return invoiceStatusId?.id;
};
