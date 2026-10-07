const pool = require("../config/database");

async function createStudent({
    schoolId,
    studentNumber,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    enrollmentDate,
    currentGradeId,
    status
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO students
        (
            school_id,
            student_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            enrollment_date,
            current_grade_id,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURDATE()), ?, COALESCE(?, 'active'))
        `,
        [
            schoolId,
            studentNumber,
            firstName,
            lastName,
            dateOfBirth,
            gender || null,
            enrollmentDate || null,
            currentGradeId || null,
            status || null
        ]
    );

    return result.insertId;
}


async function findAllStudents(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            student_id,
            school_id,
            user_id,
            student_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            enrollment_date,
            current_grade_id,
            status,
            created_at
        FROM students
        WHERE school_id = ?
        ORDER BY student_id DESC
        `,
        [schoolId]
    );

    return rows;
}


async function findStudentById(studentId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            student_id,
            school_id,
            user_id,
            student_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            enrollment_date,
            current_grade_id,
            status,
            created_at
        FROM students
        WHERE student_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [studentId, schoolId]
    );

    return rows[0] || null;
}


async function updateStudent(
    studentId,
    schoolId,
    {
        studentNumber,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        enrollmentDate,
        currentGradeId,
        status
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE students
        SET
            student_number = ?,
            first_name = ?,
            last_name = ?,
            date_of_birth = ?,
            gender = ?,
            enrollment_date = ?,
            current_grade_id = ?,
            status = ?
        WHERE student_id = ?
          AND school_id = ?
        `,
        [
            studentNumber,
            firstName,
            lastName,
            dateOfBirth,
            gender || null,
            enrollmentDate,
            currentGradeId || null,
            status,
            studentId,
            schoolId
        ]
    );

    return result.affectedRows;
}


async function deleteStudent(studentId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM students
        WHERE student_id = ?
          AND school_id = ?
        `,
        [studentId, schoolId]
    );

    return result.affectedRows;
}


module.exports = {
    createStudent,
    findAllStudents,
    findStudentById,
    updateStudent,
    deleteStudent
};