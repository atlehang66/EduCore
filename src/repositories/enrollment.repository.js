const pool = require("../config/database");

async function findAllEnrollments(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            enrollment_id,
            school_id,
            student_id,
            class_id,
            academic_year_id,
            enrollment_date,
            status
        FROM enrollments
        WHERE school_id = ?
        ORDER BY enrollment_date DESC, enrollment_id DESC
        `,
        [schoolId]
    );

    return rows;
}
async function findEnrollmentById(enrollmentId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            enrollment_id,
            school_id,
            student_id,
            class_id,
            academic_year_id,
            enrollment_date,
            status
        FROM enrollments
        WHERE enrollment_id = ?
          AND school_id = ?
        `,
        [enrollmentId, schoolId]
    );

    return rows[0] || null;
}
async function findExistingEnrollment(
    studentId,
    classId,
    academicYearId,
    schoolId
) {
    const [rows] = await pool.execute(
        `
        SELECT
            enrollment_id,
            student_id,
            class_id,
            academic_year_id,
            enrollment_date,
            status
        FROM enrollments
        WHERE student_id = ?
          AND class_id = ?
          AND academic_year_id = ?
          AND school_id = ?
        `,
        [
            studentId,
            classId,
            academicYearId,
            schoolId
        ]
    );

    return rows[0] || null;
}
async function createEnrollment({
    schoolId,
    studentId,
    classId,
    academicYearId,
    enrollmentDate,
    status
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO enrollments (
            school_id,
            student_id,
            class_id,
            academic_year_id,
            enrollment_date,
            status
        )
        VALUES (?, ?, ?, ?, COALESCE(?, CURDATE()), ?)
        `,
        [
            schoolId,
            studentId,
            classId,
            academicYearId,
            enrollmentDate || null,
            status || "active"
        ]
    );

    return result.insertId;
}
async function updateEnrollment(
    enrollmentId,
    schoolId,
    {
        studentId,
        classId,
        academicYearId,
        enrollmentDate,
        status
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE enrollments
        SET
            student_id = ?,
            class_id = ?,
            academic_year_id = ?,
            enrollment_date = COALESCE(?, enrollment_date),
            status = ?
        WHERE enrollment_id = ?
          AND school_id = ?
        `,
        [
            studentId,
            classId,
            academicYearId,
            enrollmentDate || null,
            status || "active",
            enrollmentId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteEnrollment(enrollmentId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM enrollments
        WHERE enrollment_id = ?
          AND school_id = ?
        `,
        [enrollmentId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllEnrollments,
    findEnrollmentById,
    findExistingEnrollment,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};