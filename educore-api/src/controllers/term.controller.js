const termService = require("../services/term.service");

async function getTerms(req, res, next) {
    try {
        const result = await termService.getAllTerms(
            Number(req.params.academicYearId),
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
async function getTermById(req, res, next) {
    try {
        const result = await termService.getTermById(
            Number(req.params.id),
            Number(req.params.academicYearId),
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
async function createTerm(req, res, next) {
    try {
        const result = await termService.createTerm({
            academicYearId: Number(req.params.academicYearId),
            schoolId: req.user.school_id,
            name: req.body.name,
            startDate: req.body.start_date,
            endDate: req.body.end_date,
            termOrder: req.body.term_order
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
async function updateTerm(req, res, next) {
    try {
        const result = await termService.updateTerm(
            Number(req.params.id),
            Number(req.params.academicYearId),
            req.user.school_id,
            {
                name: req.body.name,
                startDate: req.body.start_date,
                endDate: req.body.end_date,
                termOrder: req.body.term_order
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
async function deleteTermById(req, res, next) {
    try {
        const result =
            await termService.deleteTermById(
                Number(req.params.id),
                Number(req.params.academicYearId),
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
    getTerms,
    getTermById,
    createTerm,
    updateTerm,
    deleteTermById
};