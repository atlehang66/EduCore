const pool = require("../config/database");

async function findAllDiscounts(schoolId) {
    const [rows] = await pool.query(
        `SELECT discount_id, school_id, name, type, percentage, amount, is_active, starts_at, ends_at, created_at, updated_at FROM discounts WHERE school_id = ? ORDER BY discount_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findDiscountById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT discount_id, school_id, name, type, percentage, amount, is_active, starts_at, ends_at, created_at, updated_at FROM discounts WHERE discount_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function findDiscountByName(name, schoolId) {
    const [rows] = await pool.query(
        `SELECT discount_id FROM discounts WHERE name = ? AND school_id = ? LIMIT 1`,
        [name, schoolId]
    );
    return rows[0] || null;
}

async function createDiscount({ schoolId, name, type, percentage, amount, isActive, startsAt, endsAt }) {
    const [result] = await pool.query(
        `INSERT INTO discounts (school_id, name, type, percentage, amount, is_active, starts_at, ends_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [schoolId, name, type || null, percentage || null, amount || null, isActive ? 1 : 0, startsAt || null, endsAt || null]
    );
    return result.insertId;
}

async function updateDiscount(id, schoolId, { name, type, percentage, amount, isActive, startsAt, endsAt }) {
    const [result] = await pool.query(
        `UPDATE discounts SET name = ?, type = ?, percentage = ?, amount = ?, is_active = ?, starts_at = ?, ends_at = ? WHERE discount_id = ? AND school_id = ?`,
        [name, type || null, percentage || null, amount || null, isActive ? 1 : 0, startsAt || null, endsAt || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteDiscount(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM discounts WHERE discount_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findAllDiscounts,
    findDiscountById,
    findDiscountByName,
    createDiscount,
    updateDiscount,
    deleteDiscount
};