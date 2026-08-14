const reportCardRepository = require("../repositories/reportCard.repository");
const studentRepository = require("../repositories/student.repository");
const termRepository = require("../repositories/term.repository");

async function getAllReportCards(schoolId) {
    const reportCards = await reportCardRepository.findAllReportCards(schoolId);
    return { success: true, statusCode: 200, data: { report_cards: reportCards } };
}

async function getReportCardById(reportCardId, schoolId) {
    const rc = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    if (!rc) return { success: false, statusCode: 404, message: 'Report card not found' };
    return { success: true, statusCode: 200, data: { report_card: rc } };
}

async function createReportCard({ schoolId, studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt }) {
    if (!studentId || !termId) {
        return { success: false, statusCode: 400, message: 'student_id and term_id are required' };
    }

    // Validate student
    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    // Validate term
    const term = await termRepository.findTermById(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: 'Term not found' };

    // Prevent duplicate report card for student+term
    const existing = await reportCardRepository.findExistingReportCard(studentId, termId, schoolId);
    if (existing) return { success: false, statusCode: 409, message: 'Report card already exists for this student and term' };

    const reportCardId = await reportCardRepository.createReportCard({ schoolId, studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt });
    if (!reportCardId) {
        return { success: false, statusCode: 500, message: 'Failed to create report card' };
    }
    const rc = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    return { success: true, statusCode: 201, data: { report_card: rc } };
}

async function updateReportCard(reportCardId, schoolId, { studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt }) {
    const existing = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Report card not found' };

    if (!studentId || !termId) {
        return { success: false, statusCode: 400, message: 'student_id and term_id are required' };
    }

    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    const term = await termRepository.findTermById(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: 'Term not found' };

    const duplicate = await reportCardRepository.findExistingReportCard(studentId, termId, schoolId);
    if (duplicate && duplicate.report_card_id !== Number(reportCardId)) {
        return { success: false, statusCode: 409, message: 'Another report card exists for this student and term' };
    }

    await reportCardRepository.updateReportCard(reportCardId, schoolId, { studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt });
    const rc = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    return { success: true, statusCode: 200, data: { report_card: rc } };
}

async function deleteReportCardById(reportCardId, schoolId) {
    const existing = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Report card not found' };

    await reportCardRepository.deleteReportCard(reportCardId, schoolId);
    return { success: true, statusCode: 200, message: 'Report card deleted successfully' };
}

module.exports = {
    getAllReportCards,
    getReportCardById,
    createReportCard,
    updateReportCard,
    deleteReportCardById
};