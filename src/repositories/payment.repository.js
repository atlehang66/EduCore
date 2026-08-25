const pool = require("../config/database");

async function findAllPayments(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            payment_id,
            school_id,
            invoice_id,
            payment_method_id,
            amount,
            paid_at,
            reference_number,
            received_by,
            notes
        FROM payments
        WHERE school_id = ?
        ORDER BY payment_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findPaymentById(paymentId, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            payment_id,
            school_id,
            invoice_id,
            payment_method_id,
            amount,
            paid_at,
            reference_number,
            received_by,
            notes
        FROM payments
        WHERE payment_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [paymentId, schoolId]
    );

    return rows[0] || null;
}

async function createPayment({
    schoolId,
    invoiceId,
    paymentMethodId,
    amount,
    paidAt,
    referenceNumber,
    receivedBy,
    notes
}) {
    const [result] = await pool.query(
        `
        INSERT INTO payments (
            school_id,
            invoice_id,
            payment_method_id,
            amount,
            paid_at,
            reference_number,
            received_by,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            invoiceId,
            paymentMethodId,
            amount,
            paidAt || null,
            referenceNumber || null,
            receivedBy || null,
            notes || null
        ]
    );

    return result.insertId;
}

async function updatePayment(
    paymentId,
    schoolId,
    {
        invoiceId,
        paymentMethodId,
        amount,
        paidAt,
        referenceNumber,
        receivedBy,
        notes
    }
) {
    const [result] = await pool.query(
        `
        UPDATE payments
        SET
            invoice_id = ?,
            payment_method_id = ?,
            amount = ?,
            paid_at = ?,
            reference_number = ?,
            received_by = ?,
            notes = ?
        WHERE payment_id = ?
          AND school_id = ?
        `,
        [
            invoiceId,
            paymentMethodId,
            amount,
            paidAt,
            referenceNumber || null,
            receivedBy || null,
            notes || null,
            paymentId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deletePayment(paymentId, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM payments
        WHERE payment_id = ?
          AND school_id = ?
        `,
        [paymentId, schoolId]
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