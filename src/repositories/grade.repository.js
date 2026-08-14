const pool = require("../config/database");

async function findAllGrades(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            grade_id,
            school_id,
            name,
            level_order
        FROM grades
        WHERE school_id = ?
        ORDER BY level_order ASC
        `,
        [schoolId]
    );

    return rows;
}

async function findGradeById(gradeId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            grade_id,
            school_id,
            name,
            level_order
        FROM grades
        WHERE grade_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [gradeId, schoolId]
    );

    return rows[0] || null;
}

async function createGrade({
    schoolId,
    name,
    levelOrder
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO grades
        (
            school_id,
            name,
            level_order
        )
        VALUES (?, ?, ?)
        `,
        [
            schoolId,
            name,
            levelOrder
        ]
    );

    return result.insertId;
}

async function deleteGrade(gradeId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM grades
        WHERE grade_id = ?
          AND school_id = ?
        `,
        [gradeId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllGrades,
    findGradeById,
    createGrade,
    deleteGrade
};