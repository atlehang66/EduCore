const reportCardRepository = require("../repositories/reportCard.repository");
const studentRepository = require("../repositories/student.repository");
const termRepository = require("../repositories/term.repository");
const enrollmentRepository = require("../repositories/enrollment.repository");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function isValidNumber(value, minimum, maximum) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue >= minimum && (maximum === undefined || numericValue <= maximum);
}

function isValidDateTime(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
        return false;
    }

    const [datePart, timePart] = value.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day &&
        date.getUTCHours() === hour &&
        date.getUTCMinutes() === minute &&
        date.getUTCSeconds() === second
    );
}

async function getValidatedTerm(termId, schoolId) {
    if (!isPositiveInteger(termId)) {
        return null;
    }

    return termRepository.findTermByIdAndSchool(termId, schoolId);
}

async function studentEnrolledInAcademicYear(studentId, academicYearId, schoolId) {
    const enrollments = await enrollmentRepository.findAllEnrollments(schoolId);
    return enrollments.some(
        (enrollment) =>
            String(enrollment.student_id) === String(studentId) &&
            String(enrollment.academic_year_id) === String(academicYearId)
    );
}

async function getAllReportCards(schoolId) {
    const reportCards = await reportCardRepository.findAllReportCards(schoolId);
    return { success: true, statusCode: 200, data: { report_cards: reportCards } };
}

async function getReportCardById(reportCardId, schoolId) {
    if (!isPositiveInteger(reportCardId)) {
        return { success: false, statusCode: 404, message: 'Report card not found' };
    }

    const rc = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    if (!rc) return { success: false, statusCode: 404, message: 'Report card not found' };
    return { success: true, statusCode: 200, data: { report_card: rc } };
}

async function createReportCard({ schoolId, studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt }) {
    if (!isPositiveInteger(studentId) || !isPositiveInteger(termId)) {
        return { success: false, statusCode: 400, message: 'student_id and term_id are required' };
    }

    if (overallAverage !== undefined && overallAverage !== null && !isValidNumber(overallAverage, 0, 100)) {
        return { success: false, statusCode: 400, message: 'overall_average must be between 0 and 100' };
    }
    if (classRank !== undefined && classRank !== null && (!Number.isInteger(Number(classRank)) || Number(classRank) < 1)) {
        return { success: false, statusCode: 400, message: 'class_rank must be an integer greater than or equal to 1' };
    }
    if (generatedAt !== undefined && generatedAt !== null && !isValidDateTime(generatedAt)) {
        return { success: false, statusCode: 400, message: 'generated_at must be a valid datetime' };
    }
    if (publishedAt !== undefined && publishedAt !== null && !isValidDateTime(publishedAt)) {
        return { success: false, statusCode: 400, message: 'published_at must be a valid datetime' };
    }

    // Validate student
    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    // Validate term
    const term = await getValidatedTerm(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: 'Term not found' };

    if (!(await studentEnrolledInAcademicYear(studentId, term.academic_year_id, schoolId))) {
        return { success: false, statusCode: 404, message: 'Student is not enrolled in this academic year' };
    }

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
    if (!isPositiveInteger(reportCardId)) {
        return { success: false, statusCode: 404, message: 'Report card not found' };
    }

    const existing = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Report card not found' };

    if (!isPositiveInteger(studentId) || !isPositiveInteger(termId)) {
        return { success: false, statusCode: 400, message: 'student_id and term_id are required' };
    }

    if (overallAverage !== undefined && overallAverage !== null && !isValidNumber(overallAverage, 0, 100)) {
        return { success: false, statusCode: 400, message: 'overall_average must be between 0 and 100' };
    }
    if (classRank !== undefined && classRank !== null && (!Number.isInteger(Number(classRank)) || Number(classRank) < 1)) {
        return { success: false, statusCode: 400, message: 'class_rank must be an integer greater than or equal to 1' };
    }
    if (generatedAt !== undefined && generatedAt !== null && !isValidDateTime(generatedAt)) {
        return { success: false, statusCode: 400, message: 'generated_at must be a valid datetime' };
    }
    if (publishedAt !== undefined && publishedAt !== null && !isValidDateTime(publishedAt)) {
        return { success: false, statusCode: 400, message: 'published_at must be a valid datetime' };
    }

    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    const term = await getValidatedTerm(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: 'Term not found' };

    if (!(await studentEnrolledInAcademicYear(studentId, term.academic_year_id, schoolId))) {
        return { success: false, statusCode: 404, message: 'Student is not enrolled in this academic year' };
    }

    const duplicate = await reportCardRepository.findExistingReportCard(studentId, termId, schoolId);
    if (duplicate && duplicate.report_card_id !== Number(reportCardId)) {
        return { success: false, statusCode: 409, message: 'Another report card exists for this student and term' };
    }

    await reportCardRepository.updateReportCard(reportCardId, schoolId, { studentId, termId, overallAverage, classRank, teacherComments, principalComments, generatedAt, publishedAt });
    const rc = await reportCardRepository.findReportCardById(reportCardId, schoolId);
    return { success: true, statusCode: 200, data: { report_card: rc } };
}

async function deleteReportCardById(reportCardId, schoolId) {
    if (!isPositiveInteger(reportCardId)) {
        return { success: false, statusCode: 404, message: 'Report card not found' };
    }

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