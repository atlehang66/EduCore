const academicYearService = require("../services/academicYear.service");

async function getAcademicYears(req, res, next) {
    try {
        const result =
            await academicYearService.getAllAcademicYears(
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
async function getAcademicYearById(req, res, next) {
    try {
        const result =
            await academicYearService.getAcademicYearById(
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
async function createAcademicYear(req, res, next) {
    try {
        const result =
            await academicYearService.createAcademicYear({
                schoolId: req.user.school_id,
                name: req.body.name,
                startDate: req.body.start_date,
                endDate: req.body.end_date,
                isCurrent: req.body.is_current
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
async function updateAcademicYear(req, res, next) {
    try {
        const result =
            await academicYearService.updateAcademicYear(
                Number(req.params.id),
                req.user.school_id,
                {
                    name: req.body.name,
                    startDate: req.body.start_date,
                    endDate: req.body.end_date,
                    isCurrent: req.body.is_current
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
async function deleteAcademicYearById(req, res, next) {
    try {
        const result =
            await academicYearService.deleteAcademicYearById(
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
    getAcademicYears,
    getAcademicYearById,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYearById
};