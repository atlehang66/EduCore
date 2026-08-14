const loginHistoryService = require("../services/loginHistory.service");

async function getLoginHistory(req, res, next) {
    try {
        const result = await loginHistoryService.getAllLoginHistory();
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getLoginById(req, res, next) {
    try {
        const result = await loginHistoryService.getLoginById(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createLogin(req, res, next) {
    try {
        const { user_id, ip_address, user_agent, success } = req.body;
        const result = await loginHistoryService.createLogin({ user_id, ip_address, user_agent, success });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

module.exports = { getLoginHistory, getLoginById, createLogin };