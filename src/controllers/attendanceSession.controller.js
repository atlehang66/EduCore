const attendanceSessionService = require("../services/attendanceSession.service");

async function getAttendanceSessions(req, res, next) {
    try {
        const result = await attendanceSessionService.getAllAttendanceSessions(
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
}

async function getAttendanceSessionById(req, res, next) {
    try {
        const result = await attendanceSessionService.getAttendanceSessionById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function createAttendanceSession(req, res, next) {
    try {
        const result = await attendanceSessionService.createAttendanceSession({
            schoolId: req.user.school_id,
            classId: req.body.class_id,
            subjectId: req.body.subject_id,
            teacherId: req.body.teacher_id,
            sessionDate: req.body.session_date,
            period: req.body.period
        });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function updateAttendanceSession(req, res, next) {
    try {
        const result = await attendanceSessionService.updateAttendanceSession(
            req.params.id,
            req.user.school_id,
            {
                classId: req.body.class_id,
                subjectId: req.body.subject_id,
                teacherId: req.body.teacher_id,
                sessionDate: req.body.session_date,
                period: req.body.period
            }
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function deleteAttendanceSessionById(req, res, next) {
    try {
        const result = await attendanceSessionService.deleteAttendanceSessionById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAttendanceSessions,
    getAttendanceSessionById,
    createAttendanceSession,
    updateAttendanceSession,
    deleteAttendanceSessionById
};
