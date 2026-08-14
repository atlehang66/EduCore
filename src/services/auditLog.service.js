const auditLogRepository = require("../repositories/auditLog.repository");

async function getAllAuditLogs() {
    const rows = await auditLogRepository.findAllAuditLogs();
    return { success: true, statusCode: 200, data: { audit_logs: rows } };
}

async function getAuditLogById(id) {
    const row = await auditLogRepository.findAuditLogById(id);
    if (!row) return { success: false, statusCode: 404, message: "Audit log not found" };
    return { success: true, statusCode: 200, data: { audit_log: row } };
}

async function createAuditLog({ user_id, action, details, ip_address }) {
    const id = await auditLogRepository.createAuditLog({ userId: user_id, action, details, ipAddress: ip_address });
    const created = await auditLogRepository.findAuditLogById(id);
    return { success: true, statusCode: 201, data: { audit_log: created } };
}

module.exports = { getAllAuditLogs, getAuditLogById, createAuditLog };