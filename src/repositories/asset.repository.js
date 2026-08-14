const pool = require("../config/database");

async function findAllAssets(schoolId) {
    const [rows] = await pool.query(
        `SELECT asset_id, school_id, name, description, value, location, status, created_at, updated_at FROM assets WHERE school_id = ? ORDER BY asset_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findAssetById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT asset_id, school_id, name, description, value, location, status, created_at, updated_at FROM assets WHERE asset_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createAsset({ schoolId, name, description, value, location, status }) {
    const [result] = await pool.query(
        `INSERT INTO assets (school_id, name, description, value, location, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, name, description || null, value || null, location || null, status || null]
    );
    return result.insertId;
}

async function updateAsset(id, schoolId, { name, description, value, location, status }) {
    const [result] = await pool.query(
        `UPDATE assets SET name = ?, description = ?, value = ?, location = ?, status = ? WHERE asset_id = ? AND school_id = ?`,
        [name, description || null, value || null, location || null, status || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteAsset(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM assets WHERE asset_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findAllAssets,
    findAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};