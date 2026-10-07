const attendanceRepository =
    require("../repositories/attendance.repository");

const studentRepository =
    require("../repositories/student.repository");

const attendanceSessionRepository =
    require("../repositories/attendanceSession.repository");

const enrollmentRepository =
    require("../repositories/enrollment.repository");

const validStatuses = [
    "present",
    "absent",
    "late",
    "excused"
];

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

async function studentIsEnrolledInClass(studentId, classId, schoolId) {
    const enrollments = await enrollmentRepository.findAllEnrollments(schoolId);

    return enrollments.some(
        (enrollment) =>
            String(enrollment.student_id) === String(studentId) &&
            String(enrollment.class_id) === String(classId)
    );
}

async function getAllAttendance(schoolId) {
    const attendance =
        await attendanceRepository.findAllAttendance(
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            attendance
        }
    };
}

async function getAttendanceById(
    attendanceId,
    schoolId
) {
    if (!isPositiveInteger(attendanceId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    const attendance =
        await attendanceRepository.findAttendanceById(
            attendanceId,
            schoolId
        );

    if (!attendance) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            attendance
        }
    };
}

async function createAttendance({
    schoolId,
    sessionId,
    studentId,
    status,
    remarks
}) {
    if (!isPositiveInteger(sessionId) || !isPositiveInteger(studentId)) {
        return {
            success: false,
            statusCode: 400,
            message:
                "session_id and student_id must be positive integers"
        };
    }

    const attendanceStatus = status === undefined ? "present" : status;

    if (!validStatuses.includes(attendanceStatus)) {
        return {
            success: false,
            statusCode: 400,
            message:
                "status must be present, absent, late or excused"
        };
    }

    const student =
        await studentRepository.findStudentById(
            studentId,
            schoolId
        );

    if (!student) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    const session =
        await attendanceSessionRepository.findAttendanceSessionById(
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

    if (!(await studentIsEnrolledInClass(studentId, session.class_id, schoolId))) {
        return {
            success: false,
            statusCode: 404,
            message: "Student is not enrolled in this class"
        };
    }

    const existingAttendance =
        await attendanceRepository.findExistingAttendance(
            sessionId,
            studentId,
            schoolId
        );

    if (existingAttendance) {
        return {
            success: false,
            statusCode: 409,
            message:
                "Attendance already exists for this student in this session"
        };
    }

    const attendanceId =
        await attendanceRepository.createAttendance({
            schoolId,
            sessionId,
            studentId,
            status: attendanceStatus,
            remarks
        });

    const attendance =
        await attendanceRepository.findAttendanceById(
            attendanceId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            attendance
        }
    };
}

async function updateAttendance(
    attendanceId,
    schoolId,
    {
        sessionId,
        studentId,
        status,
        remarks
    }
) {
    if (!isPositiveInteger(attendanceId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    if (!isPositiveInteger(sessionId) || !isPositiveInteger(studentId)) {
        return {
            success: false,
            statusCode: 400,
            message:
                "session_id and student_id must be positive integers"
        };
    }

    if (!validStatuses.includes(status)) {
        return {
            success: false,
            statusCode: 400,
            message:
                "status must be present, absent, late or excused"
        };
    }

    const existingAttendance =
        await attendanceRepository.findAttendanceById(
            attendanceId,
            schoolId
        );

    if (!existingAttendance) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    const student =
        await studentRepository.findStudentById(
            studentId,
            schoolId
        );

    if (!student) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    const session =
        await attendanceSessionRepository.findAttendanceSessionById(
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

    if (!(await studentIsEnrolledInClass(studentId, session.class_id, schoolId))) {
        return {
            success: false,
            statusCode: 404,
            message: "Student is not enrolled in this class"
        };
    }

    const duplicate =
        await attendanceRepository.findExistingAttendance(
            sessionId,
            studentId,
            schoolId
        );

    if (
        duplicate &&
        duplicate.attendance_id !== Number(attendanceId)
    ) {
        return {
            success: false,
            statusCode: 409,
            message:
                "Attendance already exists for this student in this session"
        };
    }

    await attendanceRepository.updateAttendance(
        attendanceId,
        schoolId,
        {
            sessionId,
            studentId,
            status,
            remarks
        }
    );

    const attendance =
        await attendanceRepository.findAttendanceById(
            attendanceId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            attendance
        }
    };
}

async function deleteAttendanceById(
    attendanceId,
    schoolId
) {
    if (!isPositiveInteger(attendanceId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    const existingAttendance =
        await attendanceRepository.findAttendanceById(
            attendanceId,
            schoolId
        );

    if (!existingAttendance) {
        return {
            success: false,
            statusCode: 404,
            message: "Attendance record not found"
        };
    }

    await attendanceRepository.deleteAttendance(
        attendanceId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Attendance deleted successfully"
    };
}

module.exports = {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendanceById
};