const pool = require("../config/database");

async function findUserByEmailAndSchool(email, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            school_id,
            email,
            password_hash,
            first_name,
            last_name,
            phone,
            is_active,
            last_login_at
        FROM users
        WHERE email = ?
          AND school_id = ?
        LIMIT 1
        `,
        [email, schoolId]
    );

    return rows[0] || null;
}

async function findUserRoles(userId) {
    const [rows] = await pool.execute(
        `
        SELECT
            r.role_id,
            r.name,
            r.description,
            r.is_system_role
        FROM user_roles ur
        INNER JOIN roles r
            ON r.role_id = ur.role_id
        WHERE ur.user_id = ?
        `,
        [userId]
    );

    return rows;
}

async function findUserPermissions(userId) {
    const [rows] = await pool.execute(
        `
        SELECT DISTINCT
            p.permission_id,
            p.code,
            p.module,
            p.description
        FROM user_roles ur
        INNER JOIN role_permissions rp
            ON rp.role_id = ur.role_id
        INNER JOIN permissions p
            ON p.permission_id = rp.permission_id
        WHERE ur.user_id = ?
        ORDER BY p.permission_id
        `,
        [userId]
    );

    return rows;
}

async function recordLogin({
    userId,
    schoolId,
    ipAddress,
    userAgent,
    success
}) {
    await pool.execute(
        `
        INSERT INTO login_history
        (
            user_id,
            school_id,
            ip_address,
            user_agent,
            success
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            userId,
            schoolId,
            ipAddress,
            userAgent,
            success ? 1 : 0
        ]
    );
}

async function updateLastLogin(userId) {
    await pool.execute(
        `
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        `,
        [userId]
    );
}

async function findUserById(userId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            user_id,
            school_id,
            email,
            first_name,
            last_name,
            phone,
            is_active,
            last_login_at
        FROM users
        WHERE user_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [userId, schoolId]
    );

    return rows[0] || null;
}

module.exports = {
    findUserByEmailAndSchool,
    findUserById,
    findUserRoles,
    findUserPermissions,
    recordLogin,
    updateLastLogin
};