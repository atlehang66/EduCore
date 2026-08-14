const pool = require("../config/database");

async function findAllStudentTransport(schoolId) {
    const [rows] = await pool.query(
        `SELECT student_transport_id, school_id, student_id, transport_id, pickup_point, dropoff_point, active, created_at, updated_at FROM student_transport WHERE school_id = ? ORDER BY student_transport_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findStudentTransportById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT student_transport_id, school_id, student_id, transport_id, pickup_point, dropoff_point, active, created_at, updated_at FROM student_transport WHERE student_transport_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createStudentTransport({ schoolId, studentId, transportId, pickupPoint, dropoffPoint, active }) {
    const [result] = await pool.query(
        `INSERT INTO student_transport (school_id, student_id, transport_id, pickup_point, dropoff_point, active) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, studentId || null, transportId || null, pickupPoint || null, dropoffPoint || null, active ? 1 : 0]
    );
    return result.insertId;
}

async function updateStudentTransport(id, schoolId, { studentId, transportId, pickupPoint, dropoffPoint, active }) {
    const [result] = await pool.query(
        `UPDATE student_transport SET student_id = ?, transport_id = ?, pickup_point = ?, dropoff_point = ?, active = ? WHERE student_transport_id = ? AND school_id = ?`,
        [studentId || null, transportId || null, pickupPoint || null, dropoffPoint || null, active ? 1 : 0, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteStudentTransport(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM student_transport WHERE student_transport_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllStudentTransport, findStudentTransportById, createStudentTransport, updateStudentTransport, deleteStudentTransport };