const termService = require("../services/term.service");

async function getTerms(req, res, next) {
    try {
        const result = await termService.getAllTerms(
            req.params.academicYearId
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
            req.params.id,
            req.params.academicYearId
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
            academicYearId: req.params.academicYearId,
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
            req.params.id,
            req.params.academicYearId,
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
                req.params.id,
                req.params.academicYearId
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