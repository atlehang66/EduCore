const subjectService = require("../services/subject.service");

async function getSubjects(req, res, next) {
    try {
        const result = await subjectService.getAllSubjects(
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

async function getSubjectById(req, res, next) {
    try {
        const result = await subjectService.getSubjectById(
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

async function createSubject(req, res, next) {
    try {
        const result = await subjectService.createSubject({
            schoolId: req.user.school_id,
            name: req.body.name,
            code: req.body.code,
            department: req.body.department
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

async function updateSubject(req, res, next) {
    try {
        const result = await subjectService.updateSubject(
            req.params.id,
            req.user.school_id,
            {
                name: req.body.name,
                code: req.body.code,
                department: req.body.department
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

async function deleteSubjectById(req, res, next) {
    try {
        const result = await subjectService.deleteSubjectById(
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
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubjectById
};