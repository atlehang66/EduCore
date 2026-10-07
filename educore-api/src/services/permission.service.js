const permissionRepository = require("../repositories/permission.repository");

async function getAllPermissions() {
    const permissions = await permissionRepository.findAllPermissions();
    return { success: true, statusCode: 200, data: { permissions } };
}

async function getPermissionById(permissionId) {
    const p = await permissionRepository.findPermissionById(permissionId);
    if (!p) return { success: false, statusCode: 404, message: "Permission not found" };
    return { success: true, statusCode: 200, data: { permission: p } };
}

async function createPermission({ code, moduleName, description }) {
    if (!code) return { success: false, statusCode: 400, message: "code is required" };

    const existing = await permissionRepository.findPermissionByCode(code);
    if (existing) return { success: false, statusCode: 409, message: "Permission with that code already exists" };

    const permissionId = await permissionRepository.createPermission({ code, moduleName, description });
    const p = await permissionRepository.findPermissionById(permissionId);
    return { success: true, statusCode: 201, data: { permission: p } };
}

async function updatePermission(permissionId, { code, moduleName, description }) {
    const existing = await permissionRepository.findPermissionById(permissionId);
    if (!existing) return { success: false, statusCode: 404, message: "Permission not found" };

    if (!code) return { success: false, statusCode: 400, message: "code is required" };

    const duplicate = await permissionRepository.findPermissionByCode(code);
    if (duplicate && duplicate.permission_id !== Number(permissionId)) {
        return { success: false, statusCode: 409, message: "Another permission with that code exists" };
    }

    await permissionRepository.updatePermission(permissionId, { code, moduleName, description });
    const p = await permissionRepository.findPermissionById(permissionId);
    return { success: true, statusCode: 200, data: { permission: p } };
}

async function deletePermission(permissionId) {
    const existing = await permissionRepository.findPermissionById(permissionId);
    if (!existing) return { success: false, statusCode: 404, message: "Permission not found" };

    // Note: if role_permissions references exist, DB may prevent deletion; let controller map FK errors to 409
    await permissionRepository.deletePermission(permissionId);
    return { success: true, statusCode: 200, message: "Permission deleted successfully" };
}

module.exports = {
    getAllPermissions,
    getPermissionById,
    createPermission,
    updatePermission,
    deletePermission
};