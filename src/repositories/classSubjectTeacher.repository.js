const pool = require("../config/database");

async function findTeachersByClassSubject(classId, subjectId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            cst.id,
            cst.school_id,
            cst.class_id,
            cst.subject_id,
            cst.teacher_id,
            cst.academic_year_id,
            t.first_name,
            t.last_name,
            t.email
        FROM class_subject_teachers cst
        INNER JOIN teachers t
            ON t.teacher_id = cst.teacher_id
        INNER JOIN classes c
            ON c.class_id = cst.class_id
        INNER JOIN subjects s
            ON s.subject_id = cst.subject_id
        WHERE cst.class_id = ?
          AND cst.subject_id = ?
          AND cst.school_id = ?
          AND c.school_id = ?
          AND s.school_id = ?
          AND t.school_id = ?
        ORDER BY t.last_name ASC, t.first_name ASC
        `,
        [
            classId,
            subjectId,
            schoolId,
            schoolId,
            schoolId,
            schoolId
        ]
    );

    return rows;
}

async function findClassSubjectTeacher(
    classId,
    subjectId,
    teacherId,
    schoolId
) {
    const [rows] = await pool.execute(
        `
        SELECT
            id,
            school_id,
            class_id,
            subject_id,
            teacher_id,
            academic_year_id
        FROM class_subject_teachers
        WHERE class_id = ?
          AND subject_id = ?
          AND teacher_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [
            classId,
            subjectId,
            teacherId,
            schoolId
        ]
    );

    return rows[0] || null;
}

async function createClassSubjectTeacher({
    schoolId,
    classId,
    subjectId,
    teacherId,
    academicYearId
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO class_subject_teachers (
            school_id,
            class_id,
            subject_id,
            teacher_id,
            academic_year_id
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            classId,
            subjectId,
            teacherId,
            academicYearId
        ]
    );

    return result;
}

async function updateClassSubjectTeacher(
    classId,
    subjectId,
    teacherId,
    schoolId,
    { academicYearId }
) {
    const [result] = await pool.execute(
        `
        UPDATE class_subject_teachers
        SET academic_year_id = ?
        WHERE class_id = ?
          AND subject_id = ?
          AND teacher_id = ?
          AND school_id = ?
        `,
        [
            academicYearId,
            classId,
            subjectId,
            teacherId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteClassSubjectTeacher(
    classId,
    subjectId,
    teacherId,
    schoolId
) {
    const [result] = await pool.execute(
        `
        DELETE FROM class_subject_teachers
        WHERE class_id = ?
          AND subject_id = ?
          AND teacher_id = ?
          AND school_id = ?
        `,
        [
            classId,
            subjectId,
            teacherId,
            schoolId
        ]
    );

    return result.affectedRows;
}

module.exports = {
    findTeachersByClassSubject,
    findClassSubjectTeacher,
    createClassSubjectTeacher,
    updateClassSubjectTeacher,
    deleteClassSubjectTeacher
};