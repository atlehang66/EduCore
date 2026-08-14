const pool = require("../config/database");

async function findAllInventory(schoolId) {
    const [rows] = await pool.query(
        `SELECT inventory_id, school_id, asset_id, quantity, condition_status, location, created_at, updated_at FROM inventory WHERE school_id = ? ORDER BY inventory_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findInventoryById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT inventory_id, school_id, asset_id, quantity, condition_status, location, created_at, updated_at FROM inventory WHERE inventory_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createInventory({ schoolId, assetId, quantity, conditionStatus, location }) {
    const [result] = await pool.query(
        `INSERT INTO inventory (school_id, asset_id, quantity, condition_status, location) VALUES (?, ?, ?, ?, ?)`,
        [schoolId, assetId || null, quantity || 0, conditionStatus || null, location || null]
    );
    return result.insertId;
}

async function updateInventory(id, schoolId, { assetId, quantity, conditionStatus, location }) {
    const [result] = await pool.query(
        `UPDATE inventory SET asset_id = ?, quantity = ?, condition_status = ?, location = ? WHERE inventory_id = ? AND school_id = ?`,
        [assetId || null, quantity || 0, conditionStatus || null, location || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteInventory(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM inventory WHERE inventory_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllInventory, findInventoryById, createInventory, updateInventory, deleteInventory };