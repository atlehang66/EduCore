const rolePermissionService = require("../services/rolePermission.service");

async function getPermissions(req, res, next) {
    try {
        const { roleId } = req.params;
        const result = await rolePermissionService.getPermissionsForRole(Number(roleId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function addPermission(req, res, next) {
    try {
        const { roleId } = req.params;
        const { permission_id } = req.body;
        const result = await rolePermissionService.addPermissionToRole({ roleId: Number(roleId), permissionId: Number(permission_id), schoolId: req.user.school_id });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function removePermission(req, res, next) {
    try {
        const { roleId, permissionId } = req.params;
        const result = await rolePermissionService.removePermissionFromRole(Number(roleId), Number(permissionId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.message ? { message: result.message } : {}), ...(result.data ? { data: result.data } : {}) });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPermissions,
    addPermission,
    removePermission
};