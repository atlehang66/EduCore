const pool = require("../config/database");

async function findAllSubjects(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            subject_id,
            school_id,
            name,
            code,
            department
        FROM subjects
        WHERE school_id = ?
        ORDER BY subject_id DESC
        `,
        [schoolId]
    );

    return rows;
}
async function findSubjectById(subjectId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            subject_id,
            school_id,
            name,
            code,
            department
        FROM subjects
        WHERE subject_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [subjectId, schoolId]
    );

    return rows[0] || null;
}
async function createSubject({
    schoolId,
    name,
    code,
    department
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO subjects
        (
            school_id,
            name,
            code,
            department
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            schoolId,
            name,
            code,
            department || null
        ]
    );

    return result.insertId;
}
async function updateSubject(
    subjectId,
    schoolId,
    {
        name,
        code,
        department
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE subjects
        SET
            name = ?,
            code = ?,
            department = ?
        WHERE subject_id = ?
          AND school_id = ?
        `,
        [
            name,
            code,
            department || null,
            subjectId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteSubject(subjectId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM subjects
        WHERE subject_id = ?
          AND school_id = ?
        `,
        [subjectId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllSubjects,
    findSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};