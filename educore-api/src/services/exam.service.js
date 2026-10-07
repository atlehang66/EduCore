const examRepository = require("../repositories/exam.repository");
const classRepository = require("../repositories/class.repository");
const subjectRepository = require("../repositories/subject.repository");
const marksRepository = require("../repositories/marks.repository");
const termRepository = require("../repositories/term.repository");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function isValidDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function validateNumericField(value, maximum, fieldName) {
    if (value === undefined) {
        return null;
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0 || (maximum !== undefined && numericValue > maximum)) {
        return `${fieldName} must be greater than 0${maximum !== undefined ? ` and no more than ${maximum}` : ""}`;
    }

    return null;
}

async function getAllExams(schoolId) {
    const exams = await examRepository.findAllExams(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            exams
        }
    };
}

async function getExamById(examId, schoolId) {
    if (!isPositiveInteger(examId)) {
        return { success: false, statusCode: 404, message: "Exam not found" };
    }

    const exam = await examRepository.findExamById(examId, schoolId);

    if (!exam) {
        return {
            success: false,
            statusCode: 404,
            message: "Exam not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: { exam }
    };
}

async function createExam({
    termId,
    schoolId,
    subjectId,
    classId,
    name,
    examDate,
    maxScore,
    weightPercentage
}) {
    if (!isPositiveInteger(termId) || !isPositiveInteger(subjectId) || !isPositiveInteger(classId) || !name) {
        return {
            success: false,
            statusCode: 400,
            message: "term_id, subject_id, class_id and name are required"
        };
    }

    if (examDate !== undefined && examDate !== null && !isValidDate(examDate)) {
        return { success: false, statusCode: 400, message: "exam_date must be a valid date in YYYY-MM-DD format" };
    }

    const maxScoreError = validateNumericField(maxScore, undefined, "max_score");
    const weightError = validateNumericField(weightPercentage, 100, "weight_percentage");
    if (maxScoreError || weightError) {
        return { success: false, statusCode: 400, message: maxScoreError || weightError };
    }

    const term = await termRepository.findTermByIdAndSchool(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: "Term not found" };

    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    const examId = await examRepository.createExam({
        termId,
        schoolId,
        subjectId,
        classId,
        name,
        examDate,
        maxScore,
        weightPercentage
    });

    const exam = await examRepository.findExamById(examId, schoolId);

    return {
        success: true,
        statusCode: 201,
        data: { exam }
    };
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
    if (!isPositiveInteger(examId)) {
        return { success: false, statusCode: 404, message: "Exam not found" };
    }

    const existing = await examRepository.findExamById(examId, schoolId);

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Exam not found"
        };
    }

    if (!isPositiveInteger(termId) || !isPositiveInteger(subjectId) || !isPositiveInteger(classId) || !name) {
        return {
            success: false,
            statusCode: 400,
            message: "term_id, subject_id, class_id and name are required"
        };
    }

    if (examDate !== undefined && examDate !== null && !isValidDate(examDate)) {
        return { success: false, statusCode: 400, message: "exam_date must be a valid date in YYYY-MM-DD format" };
    }

    const maxScoreError = validateNumericField(maxScore, undefined, "max_score");
    const weightError = validateNumericField(weightPercentage, 100, "weight_percentage");
    if (maxScoreError || weightError) {
        return { success: false, statusCode: 400, message: maxScoreError || weightError };
    }

    const term = await termRepository.findTermByIdAndSchool(termId, schoolId);
    if (!term) return { success: false, statusCode: 404, message: "Term not found" };

    const cls = await classRepository.findClassById(classId, schoolId);

    if (!cls) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    const subject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    if (!subject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    await examRepository.updateExam(
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
    );

    const exam = await examRepository.findExamById(
        examId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: { exam }
    };
}

async function deleteExamById(examId, schoolId) {
    if (!isPositiveInteger(examId)) {
        return { success: false, statusCode: 404, message: "Exam not found" };
    }

    const existing = await examRepository.findExamById(examId, schoolId);
    if (!existing) {
        return { success: false, statusCode: 404, message: 'Exam not found' };
    }

    // prevent deletion if marks exist
    const markCount = await marksRepository.countMarksByExam(examId, schoolId);
    if (markCount > 0) {
        return { success: false, statusCode: 409, message: 'Cannot delete exam because marks exist for this exam' };
    }

    await examRepository.deleteExam(examId, schoolId);
    return { success: true, statusCode: 200, message: 'Exam deleted successfully' };
}

module.exports = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExamById
};

