const roleService = require("../services/role.service");

async function getRoles(req, res, next) {
    try {
        const result = await roleService.getAllRoles(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getRoleById(req, res, next) {
    try {
        const result = await roleService.getRoleById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createRole(req, res, next) {
    try {
        const { name, description, is_system_role } = req.body;
        const result = await roleService.createRole({ name, description, isSystemRole: !!is_system_role, schoolId: req.user.school_id });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateRole(req, res, next) {
    try {
        const { name, description } = req.body;
        const result = await roleService.updateRole(req.params.id, req.user.school_id, { name, description });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteRole(req, res, next) {
    try {
        const result = await roleService.deleteRole(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};