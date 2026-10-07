const pool = require("../config/database");

async function findAllAssignments(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            assignment_id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            max_score,
            created_at
        FROM assignments
        WHERE school_id = ?
        ORDER BY due_date ASC, assignment_id DESC
        `,
        [schoolId]
    );

    return rows;
}
async function findAssignmentById(assignmentId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            assignment_id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            max_score,
            created_at
        FROM assignments
        WHERE assignment_id = ?
          AND school_id = ?
        `,
        [assignmentId, schoolId]
    );

    return rows[0] || null;
}
async function createAssignment({
    schoolId,
    classId,
    subjectId,
    teacherId,
    title,
    description,
    dueDate,
    maxScore
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO assignments (
            school_id,
            class_id,
            subject_id,
            teacher_id,
            title,
            description,
            due_date,
            max_score
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            classId,
            subjectId,
            teacherId,
            title,
            description || null,
            dueDate || null,
            maxScore ?? 100.00
        ]
    );

    return result.insertId;
}
async function updateAssignment(
    assignmentId,
    schoolId,
    {
        classId,
        subjectId,
        teacherId,
        title,
        description,
        dueDate,
        maxScore
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE assignments
        SET
            class_id = ?,
            subject_id = ?,
            teacher_id = ?,
            title = ?,
            description = ?,
            due_date = ?,
            max_score = ?
        WHERE assignment_id = ?
          AND school_id = ?
        `,
        [
            classId,
            subjectId,
            teacherId,
            title,
            description || null,
            dueDate || null,
            maxScore ?? 100.00,
            assignmentId,
            schoolId
        ]
    );

    return result.affectedRows;
}
async function deleteAssignment(
    assignmentId,
    schoolId
) {
    const [result] = await pool.execute(
        `
        DELETE FROM assignments
        WHERE assignment_id = ?
          AND school_id = ?
        `,
        [assignmentId, schoolId]
    );

    return result.affectedRows;
}
module.exports = {
    findAllAssignments,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment
};