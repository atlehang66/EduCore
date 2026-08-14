const pool = require("../config/database");


async function findAllMarks(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            mark_id,
            school_id,
            student_id,
            assignment_id,
            exam_id,
            score,
            max_score,
            recorded_by,
            recorded_at,
            comments
        FROM marks
        WHERE school_id = ?
        ORDER BY recorded_at DESC, mark_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findMarkById(markId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            mark_id,
            school_id,
            student_id,
            assignment_id,
            exam_id,
            score,
            max_score,
            recorded_by,
            recorded_at,
            comments
        FROM marks
        WHERE mark_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [markId, schoolId]
    );

    return rows[0] || null;
}

async function findExistingMark(studentId, assignmentId, examId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT mark_id, school_id, student_id, assignment_id, exam_id, score, max_score, recorded_by, recorded_at, comments
        FROM marks
        WHERE student_id = ?
          AND COALESCE(assignment_id, 0) = COALESCE(?, 0)
          AND COALESCE(exam_id, 0) = COALESCE(?, 0)
          AND school_id = ?
        LIMIT 1
        `,
        [studentId, assignmentId || null, examId || null, schoolId]
    );

    return rows[0] || null;
}
async function getMarkById(req, res, next) {
    try {
        const result = await marksService.getMarkById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}
async function createMark({ schoolId, studentId, assignmentId, examId, score, maxScore, recordedBy, comments }) {
    const [result] = await pool.execute(
        `
        INSERT INTO marks (
            school_id,
            student_id,
            assignment_id,
            exam_id,
            score,
            max_score,
            recorded_by,
            comments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [schoolId, studentId, assignmentId || null, examId || null, score, maxScore, recordedBy || null, comments || null]
    );

    return result.insertId;
}

async function updateMark(markId, schoolId, { studentId, assignmentId, examId, score, maxScore, recordedBy, comments }) {
    const [result] = await pool.execute(
        `
        UPDATE marks
        SET
            student_id = ?,
            assignment_id = ?,
            exam_id = ?,
            score = ?,
            max_score = ?,
            recorded_by = ?,
            comments = ?
        WHERE mark_id = ?
          AND school_id = ?
        `,
        [studentId, assignmentId || null, examId || null, score, maxScore, recordedBy || null, comments || null, markId, schoolId]
    );

    return result.affectedRows;
}

async function deleteMark(markId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM marks
        WHERE mark_id = ?
          AND school_id = ?
        `,
        [markId, schoolId]
    );

    return result.affectedRows;
}

async function countMarksByExam(examId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT COUNT(*) AS cnt
        FROM marks
        WHERE exam_id = ?
          AND school_id = ?
        `,
        [examId, schoolId]
    );

    return rows[0] ? rows[0].cnt : 0;
}

module.exports = {
    findAllMarks,
    findMarkById,
    findExistingMark,
    createMark,
    updateMark,
    deleteMark,
    countMarksByExam
};
