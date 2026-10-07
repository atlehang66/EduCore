const pool = require("../config/database");

async function findAllNotifications(schoolId, userId) {
    const [rows] = await pool.query(
        `
        SELECT
            notification_id,
            school_id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at
        FROM notifications
        WHERE school_id = ?
          AND user_id = ?
        ORDER BY notification_id DESC
        `,
        [schoolId, userId]
    );

    return rows;
}

async function findNotificationById(id, schoolId, userId) {
    const [rows] = await pool.query(
        `
        SELECT
            notification_id,
            school_id,
            user_id,
            title,
            message,
            type,
            is_read,
            created_at
        FROM notifications
        WHERE notification_id = ?
          AND school_id = ?
          AND user_id = ?
        LIMIT 1
        `,
        [id, schoolId, userId]
    );

    return rows[0] || null;
}

async function createNotification({
    schoolId,
    userId,
    title,
    message,
    type
}) {
    const [result] = await pool.query(
        `
        INSERT INTO notifications (
            school_id,
            user_id,
            title,
            message,
            type
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            userId,
            title,
            message,
            type || "general"
        ]
    );

    return result.insertId;
}

async function markRead(id, schoolId, userId) {
    const [result] = await pool.query(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ?
          AND school_id = ?
          AND user_id = ?
        `,
        [id, schoolId, userId]
    );

    return result.affectedRows > 0;
}

async function markAllRead(schoolId, userId) {
    const [result] = await pool.query(
        `
        UPDATE notifications
        SET is_read = 1
        WHERE school_id = ?
          AND user_id = ?
          AND is_read = 0
        `,
        [schoolId, userId]
    );

    return result.affectedRows;
}

async function deleteNotification(id, schoolId, userId) {
    const [result] = await pool.query(
        `
        DELETE FROM notifications
        WHERE notification_id = ?
          AND school_id = ?
          AND user_id = ?
        `,
        [id, schoolId, userId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllNotifications,
    findNotificationById,
    createNotification,
    markRead,
    markAllRead,
    deleteNotification
};