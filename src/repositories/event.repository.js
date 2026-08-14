const pool = require("../config/database");

async function findAllEvents(schoolId) {
    const [rows] = await pool.query(
        `SELECT event_id, school_id, title, description, start_at, end_at, location, created_at, updated_at FROM events WHERE school_id = ? ORDER BY event_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findEventById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT event_id, school_id, title, description, start_at, end_at, location, created_at, updated_at FROM events WHERE event_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createEvent({ schoolId, title, description, startAt, endAt, location }) {
    const [result] = await pool.query(
        `INSERT INTO events (school_id, title, description, start_at, end_at, location) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, title, description || null, startAt || null, endAt || null, location || null]
    );
    return result.insertId;
}

async function updateEvent(id, schoolId, { title, description, startAt, endAt, location }) {
    const [result] = await pool.query(
        `UPDATE events SET title = ?, description = ?, start_at = ?, end_at = ?, location = ? WHERE event_id = ? AND school_id = ?`,
        [title, description || null, startAt || null, endAt || null, location || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteEvent(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM events WHERE event_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = {
    findAllEvents,
    findEventById,
    createEvent,
    updateEvent,
    deleteEvent
};