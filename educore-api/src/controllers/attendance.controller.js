const attendanceService =
    require("../services/attendance.service");

async function getAttendance(req, res, next) {
    try {
        const result =
            await attendanceService.getAllAttendance(
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

async function getAttendanceById(req, res, next) {
    try {
        const result =
            await attendanceService.getAttendanceById(
                Number(req.params.id),
                req.user.school_id
            );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data
                ? { data: result.data }
                : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });
    } catch (error) {
        next(error);
    }
}

async function createAttendance(req, res, next) {
    try {
        const result =
            await attendanceService.createAttendance({
                schoolId: req.user.school_id,
                sessionId: Number(req.body.session_id),
                studentId: Number(req.body.student_id),
                status: req.body.status,
                remarks: req.body.remarks
            });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data
                ? { data: result.data }
                : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });
    } catch (error) {
        next(error);
    }
}

async function updateAttendance(req, res, next) {
    try {
        const result =
            await attendanceService.updateAttendance(
                Number(req.params.id),
                req.user.school_id,
                {
                    sessionId: Number(req.body.session_id),
                    studentId: Number(req.body.student_id),
                    status: req.body.status,
                    remarks: req.body.remarks
                }
            );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data
                ? { data: result.data }
                : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });
    } catch (error) {
        next(error);
    }
}

async function deleteAttendanceById(
    req,
    res,
    next
) {
    try {
        const result =
            await attendanceService.deleteAttendanceById(
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
    getAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendanceById
};