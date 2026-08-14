const pool = require("../config/database");

async function findAllLoginHistory() {
    const [rows] = await pool.query(
        `SELECT id, user_id, ip_address, user_agent, success, created_at FROM login_history ORDER BY id DESC`
    );
    return rows;
}

async function findLoginById(id) {
    const [rows] = await pool.query(
        `SELECT id, user_id, ip_address, user_agent, success, created_at FROM login_history WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function createLoginHistory({ userId, ipAddress, userAgent, success }) {
    const [result] = await pool.query(
        `INSERT INTO login_history (user_id, ip_address, user_agent, success) VALUES (?, ?, ?, ?)`,
        [userId || null, ipAddress || null, userAgent || null, success ? 1 : 0]
    );
    return result.insertId;
}

module.exports = { findAllLoginHistory, findLoginById, createLoginHistory };