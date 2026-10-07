const pool = require("../config/database");

async function findAllRoles(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            role_id,
            school_id,
            name,
            description,
            is_system_role
        FROM roles
        WHERE (school_id = ?)
           OR (is_system_role = 1)
        ORDER BY role_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findRoleById(roleId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            role_id,
            school_id,
            name,
            description,
            is_system_role
        FROM roles
        WHERE role_id = ?
          AND (
              school_id = ?
              OR is_system_role = 1
          )
        LIMIT 1
        `,
        [roleId, schoolId]
    );

    return rows[0] || null;
}

async function findRoleByName(name, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            role_id,
            school_id,
            name,
            description,
            is_system_role
        FROM roles
        WHERE name = ?
          AND (
              school_id = ?
              OR is_system_role = 1
          )
        LIMIT 1
        `,
        [name, schoolId]
    );

    return rows[0] || null;
}

async function createRole({ name, description, isSystemRole, schoolId }) {
    const [result] = await pool.execute(
        `
        INSERT INTO roles (
            school_id,
            name,
            description,
            is_system_role
        ) VALUES (?, ?, ?, ?)
        `,
        [isSystemRole ? null : schoolId, name, description || null, isSystemRole ? 1 : 0]
    );

    return result.insertId;
}

async function updateRole(roleId, { name, description }) {
    const [result] = await pool.execute(
        `
        UPDATE roles
        SET
            name = ?,
            description = ?
        WHERE role_id = ?
        `,
        [name, description || null, roleId]
    );

    return result.affectedRows;
}

async function deleteRole(roleId) {
    const [result] = await pool.execute(
        `
        DELETE FROM roles
        WHERE role_id = ?
        `,
        [roleId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllRoles,
    findRoleById,
    findRoleByName,
    createRole,
    updateRole,
    deleteRole
};