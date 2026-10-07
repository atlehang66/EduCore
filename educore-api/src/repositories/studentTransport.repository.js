const pool = require("../config/database");

async function findAllStudentTransport(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            st.student_id,
            st.transport_id,
            st.pickup_point,
            st.assigned_at
        FROM student_transport st
        INNER JOIN students s
            ON s.student_id = st.student_id
        WHERE s.school_id = ?
        ORDER BY st.assigned_at DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findStudentTransportById(
    studentId,
    transportId,
    schoolId
) {
    const [rows] = await pool.execute(
        `
        SELECT
            st.student_id,
            st.transport_id,
            st.pickup_point,
            st.assigned_at
        FROM student_transport st
        INNER JOIN students s
            ON s.student_id = st.student_id
        WHERE st.student_id = ?
          AND st.transport_id = ?
          AND s.school_id = ?
        LIMIT 1
        `,
        [studentId, transportId, schoolId]
    );

    return rows[0] || null;
}

async function createStudentTransport({
    studentId,
    transportId,
    pickupPoint
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO student_transport (
            student_id,
            transport_id,
            pickup_point
        )
        VALUES (?, ?, ?)
        `,
        [
            studentId,
            transportId,
            pickupPoint ?? null
        ]
    );

    return {
        studentId,
        transportId
    };
}

async function updateStudentTransport(
    studentId,
    transportId,
    { pickupPoint },
    schoolId
) {
    const [result] = await pool.execute(
        `
        UPDATE student_transport st
        INNER JOIN students s
            ON s.student_id = st.student_id
        SET
            st.pickup_point = ?
        WHERE st.student_id = ?
          AND st.transport_id = ?
          AND s.school_id = ?
        `,
        [
            pickupPoint ?? null,
            studentId,
            transportId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteStudentTransport(
    studentId,
    transportId,
    schoolId
) {
    const [result] = await pool.execute(
        `
        DELETE st
        FROM student_transport st
        INNER JOIN students s
            ON s.student_id = st.student_id
        WHERE st.student_id = ?
          AND st.transport_id = ?
          AND s.school_id = ?
        `,
        [
            studentId,
            transportId,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllStudentTransport,
    findStudentTransportById,
    createStudentTransport,
    updateStudentTransport,
    deleteStudentTransport
};