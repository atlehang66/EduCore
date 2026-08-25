const pool = require("../config/database");

async function findAllEvents(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            event_id,
            school_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location,
            audience
        FROM events
        WHERE school_id = ?
        ORDER BY event_date DESC, start_time DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findEventById(id, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            event_id,
            school_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location,
            audience
        FROM events
        WHERE event_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [id, schoolId]
    );

    return rows[0] || null;
}

async function createEvent({
    schoolId,
    title,
    description,
    eventDate,
    startTime,
    endTime,
    location,
    audience
}) {
    const [result] = await pool.query(
        `
        INSERT INTO events (
            school_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location,
            audience
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            title,
            description || null,
            eventDate,
            startTime || null,
            endTime || null,
            location || null,
            audience || "all"
        ]
    );

    return result.insertId;
}

async function updateEvent(
    id,
    schoolId,
    {
        title,
        description,
        eventDate,
        startTime,
        endTime,
        location,
        audience
    }
) {
    const [result] = await pool.query(
        `
        UPDATE events
        SET
            title = ?,
            description = ?,
            event_date = ?,
            start_time = ?,
            end_time = ?,
            location = ?,
            audience = ?
        WHERE event_id = ?
          AND school_id = ?
        `,
        [
            title,
            description || null,
            eventDate,
            startTime || null,
            endTime || null,
            location || null,
            audience || "all",
            id,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteEvent(id, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM events
        WHERE event_id = ?
          AND school_id = ?
        `,
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