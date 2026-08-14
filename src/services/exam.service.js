const examRepository = require("../repositories/exam.repository");
const classRepository = require("../repositories/class.repository");
const subjectRepository = require("../repositories/subject.repository");
const marksRepository = require("../repositories/marks.repository");

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
    if (!termId || !subjectId || !classId || !name) {
        return {
            success: false,
            statusCode: 400,
            message: "subject_id, class_id and name are required"
        };
    }

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
    const existing = await examRepository.findExamById(examId, schoolId);

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Exam not found"
        };
    }

    if (!termId || !subjectId || !classId || !name) {
        return {
            success: false,
            statusCode: 400,
            message: "term_id, subject_id, class_id and name are required"
        };
    }

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

    console.log("SERVICE VALUES:", {
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

