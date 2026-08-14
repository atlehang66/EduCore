const pool = require("../config/database");

async function findAllExams(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            exam_id,
            school_id,
            term_id,
            subject_id,
            class_id,
            name,
            exam_date,
            max_score,
            weight_percentage
        FROM exams
        WHERE school_id = ?
        ORDER BY exam_date DESC, exam_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findExamById(examId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            exam_id,
            school_id,
            term_id,
            subject_id,
            class_id,
            name,
            exam_date,
            max_score,
            weight_percentage
        FROM exams
        WHERE exam_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [examId, schoolId]
    );

    return rows[0] || null;
}

async function createExam({
    schoolId,
    termId,
    subjectId,
    classId,
    name,
    examDate,
    maxScore,
    weightPercentage
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO exams (
            school_id,
            term_id,
            subject_id,
            class_id,
            name,
            exam_date,
            max_score,
            weight_percentage
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            termId,
            subjectId,
            classId,
            name,
            examDate || null,
            maxScore ?? 100.00,
            weightPercentage ?? 100.00
        ]
    );

    return result.insertId;
}
async function updateExam(
    examId,
    schoolId,
    {
        termId,
        subjectId,
        classId,
        name,
        examDate,
        maxScore,
        weightPercentage
    }
) {

    console.log("UPDATE EXAM DEBUG:", {
        examId,
        schoolId,
        termId,
        subjectId,
        classId,
        name,
        examDate,
        maxScore,
        weightPercentage
    });

    const [result] = await pool.execute(
        `
        UPDATE exams
        SET
            term_id = ?,
            subject_id = ?,
            class_id = ?,
            name = ?,
            exam_date = ?,
            max_score = ?,
            weight_percentage = ?
        WHERE exam_id = ?
          AND school_id = ?
        `,
        [
            termId,
            subjectId,
            classId,
            name,
            examDate ?? null,
            maxScore ?? 100.00,
            weightPercentage ?? 100.00,
            examId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteExam(examId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM exams
        WHERE exam_id = ?
          AND school_id = ?
        `,
        [examId, schoolId]
    );

    return result.affectedRows;
}



module.exports = {
    findAllExams,
    findExamById,
    createExam,
    updateExam,
    deleteExam
};
