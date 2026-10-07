const pool = require("../config/database");

async function findAllAttendance(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            attendance_id,
            school_id,
            session_id,
            student_id,
            status,
            remarks
        FROM attendance
        WHERE school_id = ?
        ORDER BY attendance_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findAttendanceById(attendanceId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            attendance_id,
            school_id,
            session_id,
            student_id,
            status,
            remarks
        FROM attendance
        WHERE attendance_id = ?
          AND school_id = ?
        `,
        [attendanceId, schoolId]
    );

    return rows[0] || null;
}

async function findExistingAttendance(
    sessionId,
    studentId,
    schoolId
) {
    const [rows] = await pool.execute(
        `
        SELECT
            attendance_id,
            school_id,
            session_id,
            student_id,
            status,
            remarks
        FROM attendance
        WHERE session_id = ?
          AND student_id = ?
          AND school_id = ?
        `,
        [sessionId, studentId, schoolId]
    );

    return rows[0] || null;
}

async function createAttendance({
    schoolId,
    sessionId,
    studentId,
    status,
    remarks
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO attendance (
            school_id,
            session_id,
            student_id,
            status,
            remarks
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            sessionId,
            studentId,
            status || "present",
            remarks || null
        ]
    );

    return result.insertId;
}

async function updateAttendance(
    attendanceId,
    schoolId,
    {
        sessionId,
        studentId,
        status,
        remarks
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE attendance
        SET
            session_id = ?,
            student_id = ?,
            status = ?,
            remarks = ?
        WHERE attendance_id = ?
          AND school_id = ?
        `,
        [
            sessionId,
            studentId,
            status,
            remarks || null,
            attendanceId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteAttendance(
    attendanceId,
    schoolId
) {
    const [result] = await pool.execute(
        `
        DELETE FROM attendance
        WHERE attendance_id = ?
          AND school_id = ?
        `,
        [attendanceId, schoolId]
    );

    return result.affectedRows;
}

async function countAttendanceBySession(sessionId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT COUNT(*) AS cnt
        FROM attendance
        WHERE session_id = ?
          AND school_id = ?
        `,
        [sessionId, schoolId]
    );

    return rows[0] ? rows[0].cnt : 0;
}

module.exports = {
    findAllAttendance,
    findAttendanceById,
    findExistingAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    countAttendanceBySession
};