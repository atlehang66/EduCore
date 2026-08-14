const pool = require("../config/database");

async function findAllMessages(schoolId) {
    const [rows] = await pool.query(
        `SELECT message_id, school_id, sender_id, recipient_id, subject, body, sent_at, read_at, created_at FROM messages WHERE school_id = ? ORDER BY message_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findMessageById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT message_id, school_id, sender_id, recipient_id, subject, body, sent_at, read_at, created_at FROM messages WHERE message_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createMessage({ schoolId, senderId, recipientId, subject, body, sentAt }) {
    const [result] = await pool.query(
        `INSERT INTO messages (school_id, sender_id, recipient_id, subject, body, sent_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, senderId || null, recipientId || null, subject || null, body || null, sentAt || null]
    );
    return result.insertId;
}

async function markRead(id, schoolId, readAt) {
    const [result] = await pool.query(
        `UPDATE messages SET read_at = ? WHERE message_id = ? AND school_id = ?`,
        [readAt || new Date(), id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteMessage(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM messages WHERE message_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllMessages, findMessageById, createMessage, markRead, deleteMessage };