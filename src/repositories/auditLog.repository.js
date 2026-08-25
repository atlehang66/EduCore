const pool = require("../config/database");

async function findAllAuditLogs() {
    const [rows] = await pool.query(
        `
        SELECT
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            ip_address,
            created_at
        FROM audit_logs
        ORDER BY created_at DESC
        `
    );

    return rows;
}

async function findAuditLogById(recordId) {
    const [rows] = await pool.query(
        `
        SELECT
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            ip_address,
            created_at
        FROM audit_logs
        WHERE record_id = ?
        LIMIT 1
        `,
        [recordId]
    );

    return rows[0] || null;
}

async function createAuditLog({
    action,
    tableName,
    recordId,
    oldValues,
    newValues,
    ipAddress
}) {
    const [result] = await pool.query(
        `
        INSERT INTO audit_logs (
            action,
            table_name,
            record_id,
            old_values,
            new_values,
            ip_address
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            action,
            tableName,
            recordId,
            oldValues ? JSON.stringify(oldValues) : null,
            newValues ? JSON.stringify(newValues) : null,
            ipAddress || null
        ]
    );

    return result;
}

module.exports = {
    findAllAuditLogs,
    findAuditLogById,
    createAuditLog
};