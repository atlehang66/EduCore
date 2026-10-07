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
            Number(req.params.id),
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
            classId: Number(req.body.class_id),
            subjectId: req.body.subject_id === undefined || req.body.subject_id === ""
                ? req.body.subject_id
                : Number(req.body.subject_id),
            teacherId: Number(req.body.teacher_id),
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
            Number(req.params.id),
            req.user.school_id,
            {
                classId: Number(req.body.class_id),
                subjectId: req.body.subject_id === undefined || req.body.subject_id === ""
                    ? req.body.subject_id
                    : Number(req.body.subject_id),
                teacherId: Number(req.body.teacher_id),
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
            Number(req.params.id),
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
