const loginRepo = require("../repositories/loginHistory.repository");

async function getAllLoginHistory(schoolId) {
    const rows = await loginRepo.findAllLoginHistory(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            login_history: rows
        }
    };
}

async function getLoginById(id, schoolId) {
    const r = await loginRepo.getLoginHistoryById(id, schoolId);

    if (!r) {
        return {
            success: false,
            statusCode: 404,
            message: "Login history not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            login: r
        }
    };
}

async function createLogin({
    schoolId,
    userId,
    loginAt,
    ipAddress,
    userAgent,
    success
}) {
    const id = await loginRepo.createLoginHistory({
        schoolId,
        userId,
        loginAt,
        ipAddress,
        userAgent,
        success
    });

    const created = await loginRepo.getLoginHistoryById(id, schoolId);

    return {
        success: true,
        statusCode: 201,
        data: {
            login: created
        }
    };
}

module.exports = {
    getAllLoginHistory,
    getLoginById,
    createLogin
};