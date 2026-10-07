const reportCardService = require("../services/reportCard.service");

async function getReportCards(req, res, next) {
    try {
        const result = await reportCardService.getAllReportCards(req.user.school_id);
        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function getReportCardById(req, res, next) {
    try {
        const result = await reportCardService.getReportCardById(Number(req.params.id), req.user.school_id);
        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function createReportCard(req, res, next) {
    try {
        const result = await reportCardService.createReportCard({
            schoolId: req.user.school_id,
            studentId: Number(req.body.student_id),
            termId: Number(req.body.term_id),
            overallAverage: req.body.overall_average,
            classRank: req.body.class_rank,
            teacherComments: req.body.teacher_comments,
            principalComments: req.body.principal_comments,
            generatedAt: req.body.generated_at,
            publishedAt: req.body.published_at
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

async function updateReportCard(req, res, next) {
    try {
        const result = await reportCardService.updateReportCard(Number(req.params.id), req.user.school_id, {
            studentId: Number(req.body.student_id),
            termId: Number(req.body.term_id),
            overallAverage: req.body.overall_average,
            classRank: req.body.class_rank,
            teacherComments: req.body.teacher_comments,
            principalComments: req.body.principal_comments,
            generatedAt: req.body.generated_at,
            publishedAt: req.body.published_at
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

async function deleteReportCardById(req, res, next) {
    try {
        const result = await reportCardService.deleteReportCardById(Number(req.params.id), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getReportCards,
    getReportCardById,
    createReportCard,
    updateReportCard,
    deleteReportCardById
};