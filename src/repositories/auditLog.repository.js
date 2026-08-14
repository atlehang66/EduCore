const pool = require("../config/database");

async function findAllAuditLogs() {
    const [rows] = await pool.query(
        `SELECT id, user_id, action, details, ip_address, created_at FROM audit_logs ORDER BY id DESC`
    );
    return rows;
}

async function findAuditLogById(id) {
    const [rows] = await pool.query(
        `SELECT id, user_id, action, details, ip_address, created_at FROM audit_logs WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

// write-only in many systems, but include basic create for completeness
async function createAuditLog({ userId, action, details, ipAddress }) {
    const [result] = await pool.query(
        `INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)`,
        [userId || null, action, details || null, ipAddress || null]
    );
    return result.insertId;
}

module.exports = {
    findAllAuditLogs,
    findAuditLogById,
    createAuditLog
};