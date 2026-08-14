const enrollmentService =
    require("../services/enrollment.service");

async function getEnrollments(req, res, next) {
    try {
        const result =
            await enrollmentService.getAllEnrollments(
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
async function getEnrollmentById(req, res, next) {
    try {
        const result =
            await enrollmentService.getEnrollmentById(
                req.params.id,
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
async function createEnrollment(req, res, next) {
    try {
        const result =
            await enrollmentService.createEnrollment({
                schoolId: req.user.school_id,
                studentId: req.body.student_id,
                classId: req.body.class_id,
                academicYearId: req.body.academic_year_id,
                enrollmentDate: req.body.enrollment_date,
                status: req.body.status
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
async function updateEnrollment(req, res, next) {
    try {
        const result =
            await enrollmentService.updateEnrollment(
                req.params.id,
                req.user.school_id,
                {
                    studentId: req.body.student_id,
                    classId: req.body.class_id,
                    academicYearId: req.body.academic_year_id,
                    enrollmentDate: req.body.enrollment_date,
                    status: req.body.status
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
async function deleteEnrollmentById(req, res, next) {
    try {
        const result =
            await enrollmentService.deleteEnrollmentById(
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
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollmentById
};