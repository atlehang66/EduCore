const pool = require("../config/database");

async function findAllPaymentMethods(schoolId) {
    const [rows] = await pool.query(
        `SELECT payment_method_id, school_id, name, provider, details, is_active, created_at, updated_at FROM payment_methods WHERE school_id = ? ORDER BY payment_method_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findPaymentMethodById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT payment_method_id, school_id, name, provider, details, is_active, created_at, updated_at FROM payment_methods WHERE payment_method_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function findPaymentMethodByName(name, schoolId) {
    const [rows] = await pool.query(
        `SELECT payment_method_id FROM payment_methods WHERE name = ? AND school_id = ? LIMIT 1`,
        [name, schoolId]
    );
    return rows[0] || null;
}

async function createPaymentMethod({ schoolId, name, provider, details, isActive }) {
    const [result] = await pool.query(
        `INSERT INTO payment_methods (school_id, name, provider, details, is_active) VALUES (?, ?, ?, ?, ?)`,
        [schoolId, name, provider || null, details || null, isActive ? 1 : 0]
    );
    return result.insertId;
}

async function updatePaymentMethod(id, schoolId, { name, provider, details, isActive }) {
    const [result] = await pool.query(
        `UPDATE payment_methods SET name = ?, provider = ?, details = ?, is_active = ? WHERE payment_method_id = ? AND school_id = ?`,
        [name, provider || null, details || null, isActive ? 1 : 0, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deletePaymentMethod(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM payment_methods WHERE payment_method_id = ? AND school_id = ?`,
        [id, schoolId]
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