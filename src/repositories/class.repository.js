const pool = require("../config/database");

async function findAllClasses(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            class_id,
            school_id,
            grade_id,
            academic_year_id,
            name,
            homeroom_teacher_id,
            capacity
        FROM classes
        WHERE school_id = ?
        ORDER BY class_id DESC
        `,
        [schoolId]
    );

    return rows;
}
async function findClassById(classId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            class_id,
            school_id,
            grade_id,
            academic_year_id,
            name,
            homeroom_teacher_id,
            capacity
        FROM classes
        WHERE class_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [classId, schoolId]
    );

    return rows[0] || null;
}
async function createClass({
    schoolId,
    gradeId,
    academicYearId,
    name,
    homeroomTeacherId,
    capacity
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO classes
        (
            school_id,
            grade_id,
            academic_year_id,
            name,
            homeroom_teacher_id,
            capacity
        )
        VALUES (?, ?, ?, ?, ?, COALESCE(?, 40))
        `,
        [
            schoolId,
            gradeId,
            academicYearId,
            name,
            homeroomTeacherId || null,
            capacity || null
        ]
    );

    return result.insertId;
}
async function updateClass(
    classId,
    schoolId,
    {
        gradeId,
        academicYearId,
        name,
        homeroomTeacherId,
        capacity
    }
) 
{
    const [result] = await pool.execute(
        `
        UPDATE classes
        SET
            grade_id = ?,
            academic_year_id = ?,
            name = ?,
            homeroom_teacher_id = ?,
            capacity = ?
        WHERE class_id = ?
          AND school_id = ?
        `,
        [
            gradeId,
            academicYearId,
            name,
            homeroomTeacherId || null,
            capacity,
            classId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteClass(classId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM classes
        WHERE class_id = ?
          AND school_id = ?
        `,
        [classId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllClasses,
    findClassById,
    createClass,
    updateClass,
    deleteClass
};