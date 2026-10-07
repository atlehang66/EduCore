const rolePermissionRepository = require("../repositories/rolePermission.repository");
const roleRepository = require("../repositories/role.repository");
const permissionRepository = require("../repositories/permission.repository");

async function getPermissionsForRole(roleId, schoolId) {
    // Validate role belongs to school or is system role
    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };

    const permissions = await rolePermissionRepository.findPermissionsByRole(roleId, schoolId);
    return { success: true, statusCode: 200, data: { permissions } };
}

async function addPermissionToRole({ roleId, permissionId, schoolId }) {
    if (!roleId || !permissionId) return { success: false, statusCode: 400, message: "role_id and permission_id are required" };

    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };

    const permission = await permissionRepository.findPermissionById(permissionId);
    if (!permission) return { success: false, statusCode: 404, message: "Permission not found" };

    const existing = await rolePermissionRepository.findRolePermission(roleId, permissionId);
    if (existing) return { success: false, statusCode: 409, message: "Permission already assigned to role" };

    try {
        await rolePermissionRepository.createRolePermission({ roleId, permissionId });
    } catch (error) {
        if (error && error.code === "ER_DUP_ENTRY") {
            return { success: false, statusCode: 409, message: "Permission already assigned to role" };
        }
        throw error;
    }

    return { success: true, statusCode: 201, data: { role_id: Number(roleId), permission_id: Number(permissionId) } };
}

async function removePermissionFromRole(roleId, permissionId, schoolId) {
    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };

    const permission = await permissionRepository.findPermissionById(permissionId);
    if (!permission) return { success: false, statusCode: 404, message: "Permission not found" };

    const existing = await rolePermissionRepository.findRolePermission(roleId, permissionId);
    if (!existing) return { success: false, statusCode: 404, message: "Permission not assigned to role" };

    await rolePermissionRepository.deleteRolePermission(roleId, permissionId);
    return { success: true, statusCode: 200, message: "Permission removed from role" };
}

module.exports = {
    getPermissionsForRole,
    addPermissionToRole,
    removePermissionFromRole
};