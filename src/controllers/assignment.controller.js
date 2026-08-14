const assignmentService =
    require("../services/assignment.service");

async function getAssignments(req, res, next) {
    try {
        const result =
            await assignmentService.getAllAssignments(
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
async function getAssignmentById(req, res, next) {
    try {
        const result =
            await assignmentService.getAssignmentById(
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
async function createAssignment(req, res, next) {
    try {
        const result =
            await assignmentService.createAssignment({
                schoolId: req.user.school_id,
                classId: req.body.class_id,
                subjectId: req.body.subject_id,
                teacherId: req.body.teacher_id,
                title: req.body.title,
                description: req.body.description,
                dueDate: req.body.due_date,
                maxScore: req.body.max_score
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
async function updateAssignment(req, res, next) {
    try {
        const result =
            await assignmentService.updateAssignment(
                req.params.id,
                req.user.school_id,
                {
                    classId: req.body.class_id,
                    subjectId: req.body.subject_id,
                    teacherId: req.body.teacher_id,
                    title: req.body.title,
                    description: req.body.description,
                    dueDate: req.body.due_date,
                    maxScore: req.body.max_score
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
async function deleteAssignmentById(
    req,
    res,
    next
) {
    try {
        const result =
            await assignmentService.deleteAssignmentById(
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
    getAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignmentById    
};