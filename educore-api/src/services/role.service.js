const roleRepository = require("../repositories/role.repository");

async function getAllRoles(schoolId) {
    const roles = await roleRepository.findAllRoles(schoolId);
    return { success: true, statusCode: 200, data: { roles } };
}

async function getRoleById(roleId, schoolId) {
    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };
    return { success: true, statusCode: 200, data: { role } };
}

async function createRole({ name, description, isSystemRole, schoolId }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };

    // check duplicate
    const existing = await roleRepository.findRoleByName(name, schoolId);
    if (existing) return { success: false, statusCode: 409, message: "Role with that name already exists" };

    const roleId = await roleRepository.createRole({ name, description, isSystemRole, schoolId });
    const role = await roleRepository.findRoleById(roleId, schoolId);
    return { success: true, statusCode: 201, data: { role } };
}

async function updateRole(roleId, schoolId, { name, description }) {
    const existing = await roleRepository.findRoleById(roleId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Role not found" };

    if (!name) return { success: false, statusCode: 400, message: "name is required" };

    const duplicate = await roleRepository.findRoleByName(name, schoolId);
    if (duplicate && duplicate.role_id !== Number(roleId)) {
        return { success: false, statusCode: 409, message: "Another role with that name already exists" };
    }

    await roleRepository.updateRole(roleId, { name, description });
    const role = await roleRepository.findRoleById(roleId, schoolId);
    return { success: true, statusCode: 200, data: { role } };
}

async function deleteRole(roleId, schoolId) {
    const existing = await roleRepository.findRoleById(roleId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Role not found" };

    // Prevent deletion of system roles by accident
    if (existing.is_system_role) {
        return { success: false, statusCode: 403, message: "Cannot delete a system role" };
    }

    // Delete
    await roleRepository.deleteRole(roleId);
    return { success: true, statusCode: 200, message: "Role deleted successfully" };
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};