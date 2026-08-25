const loginHistoryService = require("../services/loginHistory.service");

async function getLoginHistory(req, res, next) {
    try {
        const schoolId = req.user.schoolId;

        const result = await loginHistoryService.getAllLoginHistory(schoolId);

        return res.status(result.statusCode).json({
            success: result.success,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
}

async function getLoginById(req, res) {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;

        const result = await loginHistoryService.getLoginById(
            id,
            schoolId
        );

        return res.status(result.statusCode).json(result);

    } catch (error) {
        console.error("GET LOGIN HISTORY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function createLogin(req, res) {
    try {
        const result = await loginHistoryService.createLogin({
            schoolId: req.user.school_id,
            userId: req.user.user_id,
            ipAddress: req.body.ip_address,
            userAgent: req.body.user_agent,
            success: req.body.success
        });

        return res.status(result.statusCode).json(result);

    } catch (error) {
        console.error("CREATE LOGIN HISTORY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getLoginHistory,
    getLoginById,
    createLogin
};