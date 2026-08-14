const pool = require("../config/database");

async function findAllNotifications(schoolId) {
    const [rows] = await pool.query(
        `SELECT notification_id, school_id, user_id, title, message, read, created_at FROM notifications WHERE school_id = ? ORDER BY notification_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findNotificationById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT notification_id, school_id, user_id, title, message, read, created_at FROM notifications WHERE notification_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createNotification({ schoolId, userId, title, message }) {
    const [result] = await pool.query(
        `INSERT INTO notifications (school_id, user_id, title, message) VALUES (?, ?, ?, ?)`,
        [schoolId, userId || null, title || null, message || null]
    );
    return result.insertId;
}

async function markRead(id, schoolId) {
    const [result] = await pool.query(
        `UPDATE notifications SET read = 1 WHERE notification_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteNotification(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM notifications WHERE notification_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllNotifications, findNotificationById, createNotification, markRead, deleteNotification };