const pool = require("../config/database");

async function findAllReportCards(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            report_card_id,
            school_id,
            student_id,
            term_id,
            overall_average,
            class_rank,
            teacher_comments,
            principal_comments,
            generated_at,
            published_at
        FROM report_cards
        WHERE school_id = ?
        ORDER BY report_card_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findReportCardById(reportCardId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            report_card_id,
            school_id,
            student_id,
            term_id,
            overall_average,
            class_rank,
            teacher_comments,
            principal_comments,
            generated_at,
            published_at
        FROM report_cards
        WHERE report_card_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [reportCardId, schoolId]
    );

    return rows[0] || null;
}

async function findExistingReportCard(studentId, termId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            report_card_id,
            school_id,
            student_id,
            term_id,
            overall_average,
            class_rank,
            teacher_comments,
            principal_comments,
            generated_at,
            published_at
        FROM report_cards
        WHERE student_id = ?
          AND term_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [studentId, termId, schoolId]
    );

    return rows[0] || null;
}

async function createReportCard({ schoolId, studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt }) {
    const [result] = await pool.execute(
        `
        INSERT INTO report_cards (
            school_id,
            student_id,
            term_id,
            overall_average,
            class_rank,
            teacher_comments,
            principal_comments,
            generated_at,
            published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            studentId,
            termId,
            overallAverage || null,
            classRank || null,
            teacherComments || null,
            principalComments || null,
            generatedAt || null,
            publishedAt || null
        ]
    );

    return result.insertId;
}

async function updateReportCard(reportCardId, schoolId, { studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt }) {
    const [result] = await pool.execute(
        `
        UPDATE report_cards
        SET
            student_id = ?,
            term_id = ?,
            overall_average = ?,
            class_rank = ?,
            teacher_comments = ?,
            principal_comments = ?,
            generated_at = ?,
            published_at = ?
        WHERE report_card_id = ?
          AND school_id = ?
        `,
        [
            studentId,
            termId,
            overallAverage || null,
            classRank || null,
            teacherComments || null,
            principalComments || null,
            generatedAt || null,
            publishedAt || null,
            reportCardId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteReportCard(reportCardId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM report_cards
        WHERE report_card_id = ?
          AND school_id = ?
        `,
        [reportCardId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllReportCards,
    findReportCardById,
    findExistingReportCard,
    createReportCard,
    updateReportCard,
    deleteReportCard
};
