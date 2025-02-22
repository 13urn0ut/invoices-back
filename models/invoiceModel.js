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

exports.getAllInvoices = async (statusId, page, limit) => {
  const { invoices, count : { count } } = await sql.begin(async () => {
    const invoices = await sql`
        SELECT invoices.*, invoice_statuses.status, users.first_name, users.last_name
        FROM invoices
        JOIN invoice_statuses
        ON invoice_statuses.id = invoices.invoice_status_id
        JOIN users
        ON users.id = invoices.user_id
        ${statusId ? sql`WHERE invoice_status_id = ${statusId}` : sql``}
        ${page ? sql`LIMIT ${limit} OFFSET ${(page - 1) * limit}` : sql``}
    `;

    const [count] = await sql`
      SELECT COUNT(id)
      FROM invoices
      ${statusId ? sql`WHERE invoice_status_id = ${statusId}` : sql``}
  `;

    return { invoices, count };
  });

  return {invoices, count};
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
