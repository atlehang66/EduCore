const pool = require("../config/database");

async function findAllTeachers(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            teacher_id,
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            email,
            phone,
            hire_date,
            specialization,
            employment_status
        FROM teachers
        WHERE school_id = ?
        ORDER BY last_name ASC, first_name ASC
        `,
        [schoolId]
    );

    return rows;
}
async function findTeacherById(teacherId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            teacher_id,
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            email,
            phone,
            hire_date,
            specialization,
            employment_status
        FROM teachers
        WHERE teacher_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [teacherId, schoolId]
    );

    return rows[0] || null;
}
async function createTeacher({
    schoolId,
    userId,
    staffNumber,
    firstName,
    lastName,
    email,
    phone,
    hireDate,
    specialization,
    employmentStatus
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO teachers (
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            email,
            phone,
            hire_date,
            specialization,
            employment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            userId || null,
            staffNumber,
            firstName,
            lastName,
            email || null,
            phone || null,
            hireDate || null,
            specialization || null,
            employmentStatus || "active"
        ]
    );

    return result.insertId;
}
async function updateTeacher(
    teacherId,
    schoolId,
    {
        userId,
        staffNumber,
        firstName,
        lastName,
        email,
        phone,
        hireDate,
        specialization,
        employmentStatus
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE teachers
        SET
            user_id = ?,
            staff_number = ?,
            first_name = ?,
            last_name = ?,
            email = ?,
            phone = ?,
            hire_date = ?,
            specialization = ?,
            employment_status = ?
        WHERE teacher_id = ?
          AND school_id = ?
        `,
        [
            userId || null,
            staffNumber,
            firstName,
            lastName,
            email || null,
            phone || null,
            hireDate || null,
            specialization || null,
            employmentStatus || "active",
            teacherId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteTeacher(teacherId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM teachers
        WHERE teacher_id = ?
          AND school_id = ?
        `,
        [teacherId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllTeachers,
    findTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};