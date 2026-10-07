const teacherService = require("../services/teacher.service");

async function getTeachers(req, res, next) {
    try {
        const result =
            await teacherService.getAllTeachers(
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
async function getTeacherById(req, res, next) {
    try {
        const result =
            await teacherService.getTeacherById(
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
async function createTeacher(req, res, next) {
    try {
        const result =
            await teacherService.createTeacher({
                schoolId: req.user.school_id,
                userId: req.body.user_id,
                staffNumber: req.body.staff_number,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                hireDate: req.body.hire_date,
                specialization: req.body.specialization,
                employmentStatus: req.body.employment_status
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
async function updateTeacher(req, res, next) {
    try {
        const result =
            await teacherService.updateTeacher(
                req.params.id,
                req.user.school_id,
                {
                    userId: req.body.user_id,
                    staffNumber: req.body.staff_number,
                    firstName: req.body.first_name,
                    lastName: req.body.last_name,
                    email: req.body.email,
                    phone: req.body.phone,
                    hireDate: req.body.hire_date,
                    specialization: req.body.specialization,
                    employmentStatus: req.body.employment_status
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
async function deleteTeacherById(req, res, next) {
    try {
        const result =
            await teacherService.deleteTeacherById(
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
    getTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacherById
};