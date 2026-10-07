const permissionService = require("../services/permission.service");

async function getPermissions(req, res, next) {
    try {
        const result = await permissionService.getAllPermissions();
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getPermissionById(req, res, next) {
    try {
        const result = await permissionService.getPermissionById(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createPermission(req, res, next) {
    try {
        const { code, module, description } = req.body;
        const result = await permissionService.createPermission({ code, moduleName: module, description });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updatePermission(req, res, next) {
    try {
        const { code, module, description } = req.body;
        const result = await permissionService.updatePermission(req.params.id, { code, moduleName: module, description });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deletePermission(req, res, next) {
    try {
        const result = await permissionService.deletePermission(req.params.id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        if (error && error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({ success: false, message: "Cannot delete permission: assigned to roles" });
        }
        next(error);
    }
}

module.exports = {
    getPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
};