const userRoleService = require("../services/userRole.service");

async function getUserRoles(req, res, next) {
    try {
        const { userId } = req.params;
        const result = await userRoleService.getRolesForUser(Number(userId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function addRole(req, res, next) {
    try {
        const { userId } = req.params;
        const { role_id } = req.body;
        const result = await userRoleService.addRoleToUser({ userId: Number(userId), roleId: Number(role_id), schoolId: req.user.school_id });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function removeRole(req, res, next) {
    try {
        const { userId, roleId } = req.params;
        const result = await userRoleService.removeRoleFromUser(Number(userId), Number(roleId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.message ? { message: result.message } : {}), ...(result.data ? { data: result.data } : {}) });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUserRoles,
    addRole,
    removeRole
};