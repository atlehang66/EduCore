const pool = require("../config/database");

async function findPermissionsByRole(roleId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            p.permission_id,
            p.code,
            p.module,
            p.description
        FROM role_permissions rp
        INNER JOIN permissions p ON p.permission_id = rp.permission_id
        INNER JOIN roles r ON r.role_id = rp.role_id
        WHERE rp.role_id = ?
          AND (r.school_id = ? OR r.is_system_role = 1)
        ORDER BY p.permission_id DESC
        `,
        [roleId, schoolId]
    );

    return rows;
}

async function findRolePermission(roleId, permissionId) {
    const [rows] = await pool.execute(
        `
        SELECT
            role_id,
            permission_id
        FROM role_permissions
        WHERE role_id = ?
          AND permission_id = ?
        LIMIT 1
        `,
        [roleId, permissionId]
    );

    return rows[0] || null;
}

async function createRolePermission({ roleId, permissionId }) {
    const [result] = await pool.execute(
        `
        INSERT INTO role_permissions (
            role_id,
            permission_id
        ) VALUES (?, ?)
        `,
        [roleId, permissionId]
    );

    return result;
}

async function deleteRolePermission(roleId, permissionId) {
    const [result] = await pool.execute(
        `
        DELETE FROM role_permissions
        WHERE role_id = ?
          AND permission_id = ?
        `,
        [roleId, permissionId]
    );

    return result.affectedRows;
}

module.exports = {
    findPermissionsByRole,
    findRolePermission,
    createRolePermission,
    deleteRolePermission
};