const marksService = require("../services/marks.service");

async function getMarks(req, res, next) {
    try {
        const result = await marksService.getAllMarks(
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

async function getMarkById(req, res, next) {
    try {
        const markId = Number(req.params.id);

        if (!Number.isInteger(markId) || markId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid mark ID"
            });
        }

        const result = await marksService.getMarkById(
            markId,
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

async function createMark(req, res, next) {
    try {
        const result = await marksService.createMark({
            schoolId: req.user.school_id,
            studentId: req.body.student_id,
            assignmentId: req.body.assignment_id,
            examId: req.body.exam_id,
            score: req.body.score,
            maxScore: req.body.max_score,
            recordedBy: req.user.user_id,
            comments: req.body.comments
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

async function updateMark(req, res, next) {
    try {
        const markId = Number(req.params.id);

        if (!Number.isInteger(markId) || markId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid mark ID"
            });
        }

        const result = await marksService.updateMark(
            markId,
            req.user.school_id,
            {
                studentId: req.body.student_id,
                assignmentId: req.body.assignment_id,
                examId: req.body.exam_id,
                score: req.body.score,
                maxScore: req.body.max_score,
                recordedBy: req.user.user_id,
                comments: req.body.comments
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

async function deleteMarkById(req, res, next) {
    try {
        const markId = Number(req.params.id);

        if (!Number.isInteger(markId) || markId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid mark ID"
            });
        }

        const result = await marksService.deleteMarkById(
            markId,
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
    getMarks,
    getMarkById,
    createMark,
    updateMark,
    deleteMarkById
};