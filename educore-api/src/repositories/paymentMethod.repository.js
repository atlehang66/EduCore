const pool = require("../config/database");

async function findAllPaymentMethods(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            payment_method_id,
            school_id,
            name,
            is_active
        FROM payment_methods
        WHERE school_id = ?
        ORDER BY payment_method_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findPaymentMethodById(paymentMethodId, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            payment_method_id,
            school_id,
            name,
            is_active
        FROM payment_methods
        WHERE payment_method_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [paymentMethodId, schoolId]
    );

    return rows[0] || null;
}

async function findPaymentMethodByName(name, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            payment_method_id,
            school_id,
            name,
            is_active
        FROM payment_methods
        WHERE name = ?
          AND school_id = ?
        LIMIT 1
        `,
        [name, schoolId]
    );

    return rows[0] || null;
}

async function createPaymentMethod({ schoolId, name, isActive }) {
    const [result] = await pool.query(
        `
        INSERT INTO payment_methods (
            school_id,
            name,
            is_active
        )
        VALUES (?, ?, ?)
        `,
        [
            schoolId,
            name,
            isActive ? 1 : 0
        ]
    );

    return result.insertId;
}

async function updatePaymentMethod(
    paymentMethodId,
    schoolId,
    { name, isActive }
) {
    const [result] = await pool.query(
        `
        UPDATE payment_methods
        SET
            name = ?,
            is_active = ?
        WHERE payment_method_id = ?
          AND school_id = ?
        `,
        [
            name,
            isActive ? 1 : 0,
            paymentMethodId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deletePaymentMethod(paymentMethodId, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM payment_methods
        WHERE payment_method_id = ?
          AND school_id = ?
        `,
        [paymentMethodId, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllPaymentMethods,
    findPaymentMethodById,
    findPaymentMethodByName,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};