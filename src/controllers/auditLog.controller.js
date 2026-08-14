const auditLogService = require("../services/auditLog.service");

async function getAuditLogs(req, res, next) {
    try {
        const result = await auditLogService.getAllAuditLogs();
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getAuditLogById(req, res, next) {
    try {
        const result = await auditLogService.getAuditLogById(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createAuditLog(req, res, next) {
    try {
        const { user_id, action, details, ip_address } = req.body;
        const result = await auditLogService.createAuditLog({ user_id, action, details, ip_address });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAuditLogs, getAuditLogById, createAuditLog };