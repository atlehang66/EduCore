const classService = require("../services/class.service");

async function getClasses(req, res, next) {
    try {
        const result = await classService.getAllClasses(
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
async function getClassById(req, res, next) {
    try {
        const result = await classService.getClassById(
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
async function createClass(req, res, next) {
    try {
        const result = await classService.createClass({
            schoolId: req.user.school_id,
            gradeId: req.body.grade_id,
            academicYearId: req.body.academic_year_id,
            name: req.body.name,
            homeroomTeacherId: req.body.homeroom_teacher_id,
            capacity: req.body.capacity
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
async function updateClass(req, res, next) {
    try {
        const result = await classService.updateClass(
            req.params.id,
            req.user.school_id,
            {
                gradeId: req.body.grade_id,
                academicYearId: req.body.academic_year_id,
                name: req.body.name,
                homeroomTeacherId: req.body.homeroom_teacher_id,
                capacity: req.body.capacity
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

async function deleteClassById(req, res, next) {
    try {
        const result = await classService.deleteClassById(
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
    getClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClassById
};