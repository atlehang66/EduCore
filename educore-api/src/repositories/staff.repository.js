const pool = require("../config/database");

async function findAllStaff(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            staff_id,
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            position,
            department,
            hire_date,
            employment_status
        FROM staff
        WHERE school_id = ?
        ORDER BY last_name ASC, first_name ASC
        `,
        [schoolId]
    );

    return rows;
}
async function findStaffById(staffId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            staff_id,
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            position,
            department,
            hire_date,
            employment_status
        FROM staff
        WHERE staff_id = ?
          AND school_id = ?
        `,
        [staffId, schoolId]
    );

    return rows[0] || null;
}
async function createStaff({
    schoolId,
    userId,
    staffNumber,
    firstName,
    lastName,
    position,
    department,
    hireDate,
    employmentStatus
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO staff (
            school_id,
            user_id,
            staff_number,
            first_name,
            last_name,
            position,
            department,
            hire_date,
            employment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            userId || null,
            staffNumber,
            firstName,
            lastName,
            position || null,
            department || null,
            hireDate || null,
            employmentStatus || "active"
        ]
    );

    return result.insertId;
}
async function updateStaff(
    staffId,
    schoolId,
    {
        staffNumber,
        firstName,
        lastName,
        position,
        department,
        hireDate,
        employmentStatus
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE staff
        SET
            staff_number = ?,
            first_name = ?,
            last_name = ?,
            position = ?,
            department = ?,
            hire_date = ?,
            employment_status = ?
        WHERE staff_id = ?
          AND school_id = ?
        `,
        [
            staffNumber,
            firstName,
            lastName,
            position || null,
            department || null,
            hireDate || null,
            employmentStatus || "active",
            staffId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteStaff(staffId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM staff
        WHERE staff_id = ?
          AND school_id = ?
        `,
        [staffId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllStaff,
    findStaffById,
    createStaff,
    updateStaff,
    deleteStaff
};