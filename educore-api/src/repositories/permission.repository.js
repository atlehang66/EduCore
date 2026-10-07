const pool = require("../config/database");

async function findAllPermissions() {
    const [rows] = await pool.execute(
        `
        SELECT
            permission_id,
            code,
            module,
            description
        FROM permissions
        ORDER BY permission_id DESC
        `
    );

    return rows;
}

async function findPermissionById(permissionId) {
    const [rows] = await pool.execute(
        `
        SELECT
            permission_id,
            code,
            module,
            description
        FROM permissions
        WHERE permission_id = ?
        LIMIT 1
        `,
        [permissionId]
    );

    return rows[0] || null;
}

async function findPermissionByCode(code) {
    const [rows] = await pool.execute(
        `
        SELECT
            permission_id,
            code,
            module,
            description
        FROM permissions
        WHERE code = ?
        LIMIT 1
        `,
        [code]
    );

    return rows[0] || null;
}

async function createPermission({ code, moduleName, description }) {
    const [result] = await pool.execute(
        `
        INSERT INTO permissions (
            code,
            module,
            description
        ) VALUES (?, ?, ?)
        `,
        [code, moduleName || null, description || null]
    );

    return result.insertId;
}

async function updatePermission(permissionId, { code, moduleName, description }) {
    const [result] = await pool.execute(
        `
        UPDATE permissions
        SET
            code = ?,
            module = ?,
            description = ?
        WHERE permission_id = ?
        `,
        [code, moduleName || null, description || null, permissionId]
    );

    return result.affectedRows;
}

async function deletePermission(permissionId) {
    const [result] = await pool.execute(
        `
        DELETE FROM permissions
        WHERE permission_id = ?
        `,
        [permissionId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllPermissions,
    findPermissionById,
    findPermissionByCode,
    createPermission,
    updatePermission,
    deletePermission
};