const pool = require("../config/database");

async function findRolesByUser(userId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            r.role_id,
            r.name,
            r.description,
            r.is_system_role
        FROM user_roles ur
        INNER JOIN roles r ON r.role_id = ur.role_id
        INNER JOIN users u ON u.user_id = ur.user_id
        WHERE ur.user_id = ?
          AND u.school_id = ?
          AND (r.school_id = ? OR r.is_system_role = 1)
        ORDER BY r.role_id DESC
        `,
        [userId, schoolId, schoolId]
    );

    return rows;
}

async function findUserRole(userId, roleId) {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            role_id
        FROM user_roles
        WHERE user_id = ?
          AND role_id = ?
        LIMIT 1
        `,
        [userId, roleId]
    );

    return rows[0] || null;
}

async function createUserRole({ userId, roleId }) {
    const [result] = await pool.execute(
        `
        INSERT INTO user_roles (
            user_id,
            role_id
        ) VALUES (?, ?)
        `,
        [userId, roleId]
    );

    return result;
}

async function deleteUserRole(userId, roleId) {
    const [result] = await pool.execute(
        `
        DELETE FROM user_roles
        WHERE user_id = ?
          AND role_id = ?
        `,
        [userId, roleId]
    );

    return result.affectedRows;
}

module.exports = {
    findRolesByUser,
    findUserRole,
    createUserRole,
    deleteUserRole
};