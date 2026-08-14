const pool = require("../config/database");

async function findAllAttendanceSessions(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            session_id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            session_date,
            period,
            taken_at
        FROM attendance_sessions
        WHERE school_id = ?
        ORDER BY session_date DESC, session_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findAttendanceSessionById(sessionId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            session_id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            session_date,
            period,
            taken_at
        FROM attendance_sessions
        WHERE session_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [sessionId, schoolId]
    );

    return rows[0] || null;
}

async function findExistingAttendanceSession({
    sessionDate,
    classId,
    subjectId,
    period,
    schoolId
}) {
    const [rows] = await pool.execute(
        `
        SELECT
            session_id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            session_date,
            period,
            taken_at
        FROM attendance_sessions
        WHERE session_date = ?
          AND class_id = ?
          AND COALESCE(subject_id, 0) = COALESCE(?, 0)
          AND COALESCE(period, '') = COALESCE(?, '')
          AND school_id = ?
        LIMIT 1
        `,
        [sessionDate, classId, subjectId || null, period || null, schoolId]
    );

    return rows[0] || null;
}

async function createAttendanceSession({
    schoolId,
    classId,
    subjectId,
    teacherId,
    sessionDate,
    period
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO attendance_sessions (
            school_id,
            class_id,
            subject_id,
            teacher_id,
            session_date,
            period
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            classId,
            subjectId || null,
            teacherId,
            sessionDate,
            period || null
        ]
    );

    return result.insertId;
}

async function updateAttendanceSession(
    sessionId,
    schoolId,
    {
        classId,
        subjectId,
        teacherId,
        sessionDate,
        period
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE attendance_sessions
        SET
            class_id = ?,
            subject_id = ?,
            teacher_id = ?,
            session_date = ?,
            period = ?
        WHERE session_id = ?
          AND school_id = ?
        `,
        [
            classId,
            subjectId || null,
            teacherId,
            sessionDate,
            period || null,
            sessionId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteAttendanceSession(sessionId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM attendance_sessions
        WHERE session_id = ?
          AND school_id = ?
        `,
        [sessionId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllAttendanceSessions,
    findAttendanceSessionById,
    findExistingAttendanceSession,
    createAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSession
};
