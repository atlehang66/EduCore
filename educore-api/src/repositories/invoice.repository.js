const pool = require("../config/database");

async function findAllInvoices(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            invoice_id,
            school_id,
            student_id,
            term_id,
            invoice_number,
            description,
            amount,
            discount_id,
            due_date,
            status,
            created_at
        FROM invoices
        WHERE school_id = ?
        ORDER BY invoice_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findInvoiceById(invoiceId, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            invoice_id,
            school_id,
            student_id,
            term_id,
            invoice_number,
            description,
            amount,
            discount_id,
            due_date,
            status,
            created_at
        FROM invoices
        WHERE invoice_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [invoiceId, schoolId]
    );

    return rows[0] || null;
}

async function createInvoice({
    schoolId,
    studentId,
    termId,
    invoiceNumber,
    description,
    amount,
    discountId,
    dueDate,
    status
}) {
    const [result] = await pool.query(
        `
        INSERT INTO invoices (
            school_id,
            student_id,
            term_id,
            invoice_number,
            description,
            amount,
            discount_id,
            due_date,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            studentId,
            termId || null,
            invoiceNumber,
            description || null,
            amount,
            discountId || null,
            dueDate || null,
            status || "unpaid"
        ]
    );

    return result.insertId;
}

async function updateInvoice(
    invoiceId,
    schoolId,
    {
        studentId,
        termId,
        invoiceNumber,
        description,
        amount,
        discountId,
        dueDate,
        status
    }
) {
    const [result] = await pool.query(
        `
        UPDATE invoices
        SET
            student_id = ?,
            term_id = ?,
            invoice_number = ?,
            description = ?,
            amount = ?,
            discount_id = ?,
            due_date = ?,
            status = ?
        WHERE invoice_id = ?
          AND school_id = ?
        `,
        [
            studentId,
            termId || null,
            invoiceNumber,
            description || null,
            amount,
            discountId || null,
            dueDate || null,
            status,
            invoiceId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteInvoice(invoiceId, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM invoices
        WHERE invoice_id = ?
          AND school_id = ?
        `,
        [invoiceId, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllInvoices,
    findInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
};