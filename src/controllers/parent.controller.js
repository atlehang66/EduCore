const parentService = require("../services/parent.service");

async function getParents(req, res, next) {
    try {
        const result =
            await parentService.getAllParents(
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
async function getParentById(req, res, next) {
    try {
        const result =
            await parentService.getParentById(
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
async function createParent(req, res, next) {
    try {
        const result =
            await parentService.createParent({
                schoolId: req.user.school_id,
                userId: req.body.user_id,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                phone: req.body.phone,
                email: req.body.email,
                occupation: req.body.occupation
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
async function updateParent(req, res, next) {
    try {
        const result =
            await parentService.updateParent(
                req.params.id,
                req.user.school_id,
                {
                    userId: req.body.user_id,
                    firstName: req.body.first_name,
                    lastName: req.body.last_name,
                    phone: req.body.phone,
                    email: req.body.email,
                    occupation: req.body.occupation
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
async function deleteParentById(req, res, next) {
    try {
        const result =
            await parentService.deleteParentById(
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
    getParents,
    getParentById,
    createParent,
    updateParent,
    deleteParentById
};