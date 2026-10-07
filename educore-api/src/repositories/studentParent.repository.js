const pool = require("../config/database");

async function findAllParentsByStudent(studentId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            p.parent_id,
            p.school_id,
            p.user_id,
            p.first_name,
            p.last_name,
            p.phone,
            p.email,
            p.occupation,
            sp.relationship_type,
            sp.is_primary_contact
        FROM student_parents sp
        INNER JOIN parents p
            ON p.parent_id = sp.parent_id
        INNER JOIN students s
            ON s.student_id = sp.student_id
        WHERE sp.student_id = ?
          AND s.school_id = ?
          AND p.school_id = ?
        ORDER BY
            sp.is_primary_contact DESC,
            p.last_name ASC,
            p.first_name ASC
        `,
        [studentId, schoolId, schoolId]
    );

    return rows;
}
async function createStudentParent({
    studentId,
    parentId,
    relationshipType,
    isPrimaryContact
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO student_parents (
            student_id,
            parent_id,
            relationship_type,
            is_primary_contact
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            studentId,
            parentId,
            relationshipType,
            isPrimaryContact ? 1 : 0
        ]
    );

    return result;
}
async function updateStudentParent(
    studentId,
    parentId,
    {
        relationshipType,
        isPrimaryContact
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE student_parents
        SET
            relationship_type = ?,
            is_primary_contact = ?
        WHERE student_id = ?
          AND parent_id = ?
        `,
        [
            relationshipType,
            isPrimaryContact ? 1 : 0,
            studentId,
            parentId
        ]
    );

    return result.affectedRows;
}
async function findStudentParent(studentId, parentId) {
    const [rows] = await pool.execute(
        `
        SELECT
            student_id,
            parent_id,
            relationship_type,
            is_primary_contact
        FROM student_parents
        WHERE student_id = ?
          AND parent_id = ?
        `,
        [studentId, parentId]
    );

    return rows[0] || null;
}
async function deleteStudentParent(studentId, parentId) {
    const [result] = await pool.execute(
        `
        DELETE FROM student_parents
        WHERE student_id = ?
          AND parent_id = ?
        `,
        [studentId, parentId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllParentsByStudent,
    createStudentParent,
    updateStudentParent,
    findStudentParent,
    deleteStudentParent
};