const attendanceSessionRepository = require("../repositories/attendanceSession.repository");
const classRepository = require("../repositories/class.repository");
const teacherRepository = require("../repositories/teacher.repository");
const subjectRepository = require("../repositories/subject.repository");
const attendanceRepository = require("../repositories/attendance.repository");

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
    if (!classId || !teacherId || !sessionDate) {
        return {
            success: false,
            statusCode: 400,
            message: "class_id, teacher_id and session_date are required"
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

    if (!classId || !teacherId || !sessionDate) {
        return {
            success: false,
            statusCode: 400,
            message: "class_id, teacher_id and session_date are required"
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
