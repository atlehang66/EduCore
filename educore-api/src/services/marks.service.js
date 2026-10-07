const marksRepository = require("../repositories/marks.repository");
const studentRepository = require("../repositories/student.repository");
const assignmentRepository = require("../repositories/assignment.repository");
const examRepository = require("../repositories/exam.repository");
const enrollmentRepository = require("../repositories/enrollment.repository");

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function validateScoreFields(score, maxScore) {
    if (score === undefined || score === null || !Number.isFinite(Number(score)) || Number(score) < 0) {
        return "score must be a number greater than or equal to 0";
    }

    if (maxScore !== undefined && maxScore !== null && (!Number.isFinite(Number(maxScore)) || Number(maxScore) <= 0)) {
        return "max_score must be a number greater than 0";
    }

    const effectiveMaxScore = maxScore === undefined || maxScore === null ? 100 : Number(maxScore);
    if (Number(score) > effectiveMaxScore) {
        return "score must not exceed max_score";
    }

    return null;
}

async function studentBelongsToClass(studentId, classId, schoolId) {
    const enrollments = await enrollmentRepository.findAllEnrollments(schoolId);
    return enrollments.some(
        (enrollment) =>
            String(enrollment.student_id) === String(studentId) &&
            String(enrollment.class_id) === String(classId)
    );
}

async function getAllMarks(schoolId) {
    const marks = await marksRepository.findAllMarks(schoolId);
    return { success: true, statusCode: 200, data: { marks } };
}

async function getMarkById(markId, schoolId) {
    if (!isPositiveInteger(markId)) {
        return { success: false, statusCode: 404, message: "Mark not found" };
    }

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
    const hasAssignment = assignmentId !== null && assignmentId !== undefined;
    const hasExam = examId !== null && examId !== undefined;

    if (!isPositiveInteger(studentId) || (hasAssignment === hasExam)) {
    return {
        success: false,
        statusCode: 400,
        message: "student_id, score and exactly one of assignment_id or exam_id are required"
    };
}

    if ((hasAssignment && !isPositiveInteger(assignmentId)) || (hasExam && !isPositiveInteger(examId))) {
        return { success: false, statusCode: 400, message: "assignment_id and exam_id must be positive integers" };
    }

    const scoreError = validateScoreFields(score, maxScore);
    if (scoreError) return { success: false, statusCode: 400, message: scoreError };

    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    if (assignmentId) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId, schoolId);
        if (!assignment) return { success: false, statusCode: 404, message: 'Assignment not found' };
        if (!(await studentBelongsToClass(studentId, assignment.class_id, schoolId))) {
            return { success: false, statusCode: 404, message: 'Student is not enrolled in this class' };
        }
    }

    if (examId) {
        const exam = await examRepository.findExamById(examId, schoolId);
        if (!exam) return { success: false, statusCode: 404, message: 'Exam not found' };
        if (!(await studentBelongsToClass(studentId, exam.class_id, schoolId))) {
            return { success: false, statusCode: 404, message: 'Student is not enrolled in this class' };
        }
    }

    // Prevent duplicate mark for same student+assignment or student+exam
    const existing = await marksRepository.findExistingMark(studentId, assignmentId, examId, schoolId);
    if (existing) {
        return { success: false, statusCode: 409, message: 'Mark already exists for this student and assignment/exam' };
    }

    const markId = await marksRepository.createMark({ schoolId, studentId, assignmentId, examId, score, maxScore: maxScore ?? 100, recordedBy, comments });
    const mark = await marksRepository.findMarkById(markId, schoolId);
    return { success: true, statusCode: 201, data: { mark } };
}

async function updateMark(markId, schoolId, { studentId, assignmentId, examId, score, maxScore, recordedBy, comments }) {
    if (!isPositiveInteger(markId)) {
        return { success: false, statusCode: 404, message: 'Mark not found' };
    }

    const hasAssignment = assignmentId !== null && assignmentId !== undefined;
    const hasExam = examId !== null && examId !== undefined;
    if (!isPositiveInteger(studentId) || (hasAssignment === hasExam)) {
        return { success: false, statusCode: 400, message: 'student_id, score and exactly one of assignment_id or exam_id are required' };
    }
    if ((hasAssignment && !isPositiveInteger(assignmentId)) || (hasExam && !isPositiveInteger(examId))) {
        return { success: false, statusCode: 400, message: 'assignment_id and exam_id must be positive integers' };
    }
    const existing = await marksRepository.findMarkById(markId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: 'Mark not found' };

    const scoreError = validateScoreFields(
        score,
        maxScore === undefined || maxScore === null
            ? existing.max_score
            : maxScore
    );
    if (scoreError) return { success: false, statusCode: 400, message: scoreError };

    const student = await studentRepository.findStudentById(studentId, schoolId);
    if (!student) return { success: false, statusCode: 404, message: 'Student not found' };

    if (assignmentId) {
        const assignment = await assignmentRepository.findAssignmentById(assignmentId, schoolId);
        if (!assignment) return { success: false, statusCode: 404, message: 'Assignment not found' };
        if (!(await studentBelongsToClass(studentId, assignment.class_id, schoolId))) {
            return { success: false, statusCode: 404, message: 'Student is not enrolled in this class' };
        }
    }

    if (examId) {
        const exam = await examRepository.findExamById(examId, schoolId);
        if (!exam) return { success: false, statusCode: 404, message: 'Exam not found' };
        if (!(await studentBelongsToClass(studentId, exam.class_id, schoolId))) {
            return { success: false, statusCode: 404, message: 'Student is not enrolled in this class' };
        }
    }

    const duplicate = await marksRepository.findExistingMark(studentId, assignmentId, examId, schoolId);
    if (duplicate && duplicate.mark_id !== Number(markId)) {
        return { success: false, statusCode: 409, message: 'Another mark exists for this student and assignment/exam' };
    }

    await marksRepository.updateMark(markId, schoolId, { studentId, assignmentId, examId, score, maxScore: maxScore ?? existing.max_score, recordedBy, comments });
    const mark = await marksRepository.findMarkById(markId, schoolId);
    return { success: true, statusCode: 200, data: { mark } };
}

async function deleteMarkById(markId, schoolId) {
    if (!isPositiveInteger(markId)) {
        return { success: false, statusCode: 404, message: 'Mark not found' };
    }

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
