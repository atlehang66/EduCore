const pool = require("../config/database");

async function findAllLoginHistory(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            login_id,
            user_id,
            school_id,
            login_at,
            ip_address,
            user_agent,
            success
        FROM login_history
        WHERE school_id = ?
        ORDER BY login_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function getLoginHistoryById(id, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            login_id,
            user_id,
            school_id,
            login_at,
            ip_address,
            user_agent,
            success
        FROM login_history
        WHERE login_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [id, schoolId]
    );

    return rows[0] || null;
}

async function createLoginHistory({
    schoolId,
    userId,
    loginAt,
    ipAddress,
    userAgent,
    success
}) {
    let result;

    if (loginAt) {
        [result] = await pool.query(
            `
            INSERT INTO login_history (
                user_id,
                school_id,
                login_at,
                ip_address,
                user_agent,
                success
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                userId,
                schoolId,
                loginAt,
                ipAddress || null,
                userAgent || null,
                success ?? 1
            ]
        );
    } else {
        [result] = await pool.query(
            `
            INSERT INTO login_history (
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
                ipAddress || null,
                userAgent || null,
                success ?? 1
            ]
        );
    }

    return result.insertId;
}

async function deleteLoginHistory(id, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM login_history
        WHERE login_id = ?
          AND school_id = ?
        `,
        [id, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllLoginHistory,
    getLoginHistoryById,
    createLoginHistory,
    deleteLoginHistory
};