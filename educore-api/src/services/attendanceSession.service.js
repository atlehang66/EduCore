const attendanceSessionRepository = require("../repositories/attendanceSession.repository");
const classRepository = require("../repositories/class.repository");
const teacherRepository = require("../repositories/teacher.repository");
const subjectRepository = require("../repositories/subject.repository");
const attendanceRepository = require("../repositories/attendance.repository");

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

function isValidPeriod(period) {
    return (
        period === undefined ||
        period === null ||
        period === "" ||
        (typeof period === "string" && period.length <= 20)
    );
}

function validateSessionFields({
    classId,
    subjectId,
    teacherId,
    sessionDate,
    period
}) {
    if (!isPositiveInteger(classId) || !isPositiveInteger(teacherId)) {
        return "class_id and teacher_id must be positive integers";
    }

    if (subjectId !== undefined && subjectId !== null && subjectId !== "" && !isPositiveInteger(subjectId)) {
        return "subject_id must be a positive integer";
    }

    if (!isValidDate(sessionDate)) {
        return "session_date must be a valid date in YYYY-MM-DD format";
    }

    if (!isValidPeriod(period)) {
        return "period must be a string of 20 characters or fewer";
    }

    return null;
}

async function getAllAttendanceSessions(schoolId) {
    const sessions = await attendanceSessionRepository.findAllAttendanceSessions(
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            sessions
        }
    };
}

async function getAttendanceSessionById(sessionId, schoolId) {
    if (!isPositiveInteger(sessionId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    const session = await attendanceSessionRepository.findAttendanceSessionById(
        sessionId,
        schoolId
    );

    if (!session) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            session
        }
    };
}

async function createAttendanceSession({
    schoolId,
    classId,
    subjectId,
    teacherId,
    sessionDate,
    period
}) {
    const validationError = validateSessionFields({
        classId,
        subjectId,
        teacherId,
        sessionDate,
        period
    });

    if (validationError) {
        return {
            success: false,
            statusCode: 400,
            message: validationError
        };
    }

    // Validate class
    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    // Validate teacher
    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) {
        return {
            success: false,
            statusCode: 404,
            message: "Teacher not found"
        };
    }

    // Validate subject if provided
    if (subjectId) {
        const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
        if (!subject) {
            return {
                success: false,
                statusCode: 404,
                message: "Subject not found"
            };
        }
    }

    // Check duplicate session (same class, date, subject, period)
    const existing = await attendanceSessionRepository.findExistingAttendanceSession({
        sessionDate,
        classId,
        subjectId,
        period,
        schoolId
    });

    if (existing) {
        return {
            success: false,
            statusCode: 409,
            message: "An attendance session for this class and date (and subject/period) already exists"
        };
    }

    const sessionId = await attendanceSessionRepository.createAttendanceSession({
        schoolId,
        classId,
        subjectId,
        teacherId,
        sessionDate,
        period
    });

    const session = await attendanceSessionRepository.findAttendanceSessionById(
        sessionId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            session
        }
    };
}

async function updateAttendanceSession(
    sessionId,
    schoolId,
    { classId, subjectId, teacherId, sessionDate, period }
) {
    if (!isPositiveInteger(sessionId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    const validationError = validateSessionFields({
        classId,
        subjectId,
        teacherId,
        sessionDate,
        period
    });

    if (validationError) {
        return {
            success: false,
            statusCode: 400,
            message: validationError
        };
    }

    const existingSession = await attendanceSessionRepository.findAttendanceSessionById(
        sessionId,
        schoolId
    );

    if (!existingSession) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    // Validate class
    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    // Validate teacher
    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) {
        return {
            success: false,
            statusCode: 404,
            message: "Teacher not found"
        };
    }

    // Validate subject if provided
    if (subjectId) {
        const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
        if (!subject) {
            return {
                success: false,
                statusCode: 404,
                message: "Subject not found"
            };
        }
    }

    // Check duplicate (if changing key fields)
    const duplicate = await attendanceSessionRepository.findExistingAttendanceSession({
        sessionDate,
        classId,
        subjectId,
        period,
        schoolId
    });

    if (duplicate && duplicate.session_id !== Number(sessionId)) {
        return {
            success: false,
            statusCode: 409,
            message: "Another attendance session for this class and date (and subject/period) already exists"
        };
    }

    await attendanceSessionRepository.updateAttendanceSession(sessionId, schoolId, {
        classId,
        subjectId,
        teacherId,
        sessionDate,
        period
    });

    const session = await attendanceSessionRepository.findAttendanceSessionById(
        sessionId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            session
        }
    };
}

async function deleteAttendanceSessionById(sessionId, schoolId) {
    if (!isPositiveInteger(sessionId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    const existing = await attendanceSessionRepository.findAttendanceSessionById(
        sessionId,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance session not found"
        };
    }

    // Check for dependent attendance records
    const attendanceCount = await attendanceRepository.countAttendanceBySession(sessionId, schoolId);
    if (attendanceCount > 0) {
        return {
            success: false,
            statusCode: 409,
            message: "Cannot delete attendance session because attendance records exist for this session"
        };
    }

    await attendanceSessionRepository.deleteAttendanceSession(sessionId, schoolId);

    return {
        success: true,
        statusCode: 200,
        message: "Attendance session deleted successfully"
    };
}

module.exports = {
    getAllAttendanceSessions,
    getAttendanceSessionById,
    createAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSessionById
};
