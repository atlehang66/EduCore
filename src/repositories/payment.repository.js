const pool = require("../config/database");

async function findAllPayments(schoolId) {
    const [rows] = await pool.query(
        `SELECT payment_id, school_id, invoice_id, payment_method_id, amount, paid_at, reference, created_at, updated_at FROM payments WHERE school_id = ? ORDER BY payment_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findPaymentById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT payment_id, school_id, invoice_id, payment_method_id, amount, paid_at, reference, created_at, updated_at FROM payments WHERE payment_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createPayment({ schoolId, invoiceId, paymentMethodId, amount, paidAt, reference }) {
    const [result] = await pool.query(
        `INSERT INTO payments (school_id, invoice_id, payment_method_id, amount, paid_at, reference) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, invoiceId, paymentMethodId, amount, paidAt || null, reference || null]
    );
    return result.insertId;
}

async function updatePayment(id, schoolId, { invoiceId, paymentMethodId, amount, paidAt, reference }) {
    const [result] = await pool.query(
        `UPDATE payments SET invoice_id = ?, payment_method_id = ?, amount = ?, paid_at = ?, reference = ? WHERE payment_id = ? AND school_id = ?`,
        [invoiceId, paymentMethodId, amount, paidAt || null, reference || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deletePayment(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM payments WHERE payment_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findAllPayments,
    findPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};