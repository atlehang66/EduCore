const loginRepo = require("../repositories/loginHistory.repository");

async function getAllLoginHistory() {
    const rows = await loginRepo.findAllLoginHistory();
    return { success: true, statusCode: 200, data: { login_history: rows } };
}

async function getLoginById(id) {
    const r = await loginRepo.findLoginById(id);
    if (!r) return { success: false, statusCode: 404, message: "Login history not found" };
    return { success: true, statusCode: 200, data: { login: r } };
}

async function createLogin({ user_id, ip_address, user_agent, success }) {
    const id = await loginRepo.createLoginHistory({ userId: user_id, ipAddress: ip_address, userAgent: user_agent, success });
    const created = await loginRepo.findLoginById(id);
    return { success: true, statusCode: 201, data: { login: created } };
}

module.exports = { getAllLoginHistory, getLoginById, createLogin };