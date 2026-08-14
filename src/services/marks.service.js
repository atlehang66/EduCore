const marksRepository = require("../repositories/marks.repository");
const studentRepository = require("../repositories/student.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const examRepository = require("../repositories/exam.repository");

console.log("LOADED MARKS REPOSITORY:", marksRepository);
console.log("findMarkById TYPE:", typeof marksRepository.findMarkById);

async function getAllMarks(schoolId) {
    const marks = await marksRepository.findAllMarks(schoolId);
    return { success: true, statusCode: 200, data: { marks } };
}

async function getMarkById(markId, schoolId) {
    const mark = await marksRepository.findMarkById(
        markId,
        schoolId
    );

    if (!mark) {
        return {
            success: false,
            statusCode: 404,
            message: "Mark not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            mark
        }
    };
}

async function createMark({ schoolId, studentId, assignmentId, examId, score, maxScore, recordedBy, comments }) {
    if (
    !studentId ||
    (assignmentId == null && examId == null) ||
    (assignmentId != null && examId != null) ||
    score == null
) {
    return {
        success: false,
        statusCode: 400,
        message: "student_id, score and exactly one of assignment_id or exam_id are required"
    };
}
    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    if (assignmentId) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId, schoolId);
        if (!assignment) return { success: false, statusCode: 404, message: 'Assignment not found' };
    }

    if (examId) {
        const exam = await examRepository.findExamById(examId, schoolId);
        if (!exam) return { success: false, statusCode: 404, message: 'Exam not found' };
    }

    // Prevent duplicate mark for same student+assignment or student+exam
    const existing = await marksRepository.findExistingMark(studentId, assignmentId, examId, schoolId);
    if (existing) {
        return { success: false, statusCode: 409, message: 'Mark already exists for this student and assignment/exam' };
    }

    const markId = await marksRepository.createMark({ schoolId, studentId, assignmentId, examId, score, maxScore, recordedBy, comments });
    const mark = await marksRepository.findMarkById(markId, schoolId);
    return { success: true, statusCode: 201, data: { mark } };
}

async function updateMark(markId, schoolId, { studentId, assignmentId, examId, score, maxScore, recordedBy, comments }) {
    const existing = await marksRepository.findMarkById(markId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Mark not found' };

    if (!studentId || (assignmentId == null && examId == null) || score == null) {
        return { success: false, statusCode: 400, message: 'student_id, score and either assignment_id or exam_id are required' };
    }

    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    if (assignmentId) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId, schoolId);
        if (!assignment) return { success: false, statusCode: 404, message: 'Assignment not found' };
    }

    if (examId) {
        const exam = await examRepository.findExamById(examId, schoolId);
        if (!exam) return { success: false, statusCode: 404, message: 'Exam not found' };
    }

    const duplicate = await marksRepository.findExistingMark(studentId, assignmentId, examId, schoolId);
    if (duplicate && duplicate.mark_id !== Number(markId)) {
        return { success: false, statusCode: 409, message: 'Another mark exists for this student and assignment/exam' };
    }

    await marksRepository.updateMark(markId, schoolId, { studentId, assignmentId, examId, score, maxScore, recordedBy, comments });
    const mark = await marksRepository.findMarkById(markId, schoolId);
    return { success: true, statusCode: 200, data: { mark } };
}

async function deleteMarkById(markId, schoolId) {
    const existing = await marksRepository.findMarkById(markId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Mark not found' };

    await marksRepository.deleteMark(markId, schoolId);
    return { success: true, statusCode: 200, message: 'Mark deleted successfully' };
}

module.exports = {
    getAllMarks,
    getMarkById,
    createMark,
    updateMark,
    deleteMarkById
};
