const pool = require("../config/database");

async function findAllInvoices(schoolId) {
    const [rows] = await pool.query(
        `SELECT invoice_id, school_id, student_id, amount, status, due_date, issued_at, created_at, updated_at FROM invoices WHERE school_id = ? ORDER BY invoice_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findInvoiceById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT invoice_id, school_id, student_id, amount, status, due_date, issued_at, created_at, updated_at FROM invoices WHERE invoice_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createInvoice({ schoolId, studentId, amount, status, dueDate, issuedAt }) {
    const [result] = await pool.query(
        `INSERT INTO invoices (school_id, student_id, amount, status, due_date, issued_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, studentId, amount, status || 'pending', dueDate || null, issuedAt || null]
    );
    return result.insertId;
}

async function updateInvoice(id, schoolId, { studentId, amount, status, dueDate, issuedAt }) {
    const [result] = await pool.query(
        `UPDATE invoices SET student_id = ?, amount = ?, status = ?, due_date = ?, issued_at = ? WHERE invoice_id = ? AND school_id = ?`,
        [studentId, amount, status, dueDate || null, issuedAt || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteInvoice(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM invoices WHERE invoice_id = ? AND school_id = ?`,
        [id, schoolId]
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