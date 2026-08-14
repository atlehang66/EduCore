const studentParentService = require("../services/studentParent.service");

async function getStudentParents(req, res, next) {
    try {
        const result =
            await studentParentService.getStudentParents(
                req.params.studentId,
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
async function createStudentParent(req, res, next) {
    try {
        const result =
            await studentParentService.createStudentParent({
                studentId: req.params.studentId,
                schoolId: req.user.school_id,
                parentId: req.body.parent_id,
                relationshipType: req.body.relationship_type,
                isPrimaryContact: req.body.is_primary_contact
            });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });

    } catch (error) {
        next(error);
    }
}
async function updateStudentParent(req, res, next) {
    try {
        const result =
            await studentParentService.updateStudentParent(
                req.params.studentId,
                req.params.parentId,
                req.user.school_id,
                {
                    relationshipType:
                        req.body.relationship_type,

                    isPrimaryContact:
                        req.body.is_primary_contact
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
async function deleteStudentParent(req, res, next) {
    try {
        const result =
            await studentParentService.deleteStudentParent(
                req.params.studentId,
                req.params.parentId,
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
    getStudentParents,
    createStudentParent,
    updateStudentParent,
    deleteStudentParent
};