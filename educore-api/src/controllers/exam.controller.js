const examService = require("../services/exam.service");

async function getExams(req, res, next) {
    try {
        const result = await examService.getAllExams(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getExamById(req, res, next) {
    try {
        const result = await examService.getExamById(Number(req.params.id), req.user.school_id);
        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function createExam(req, res, next) {
    try {
        const result = await examService.createExam({
            schoolId: req.user.school_id,
            subjectId: Number(req.body.subject_id),
            classId: Number(req.body.class_id),
            termId: Number(req.body.term_id),
            name: req.body.name,
            examDate: req.body.exam_date,
            maxScore: req.body.max_score,
            weightPercentage: req.body.weight_percentage
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

async function updateExam(req, res, next) {
    try {
        const result = await examService.updateExam(Number(req.params.id), req.user.school_id, {
            termId: Number(req.body.term_id),
            subjectId: Number(req.body.subject_id),
            classId: Number(req.body.class_id),
            name: req.body.name,
            examDate: req.body.exam_date,
            maxScore: req.body.max_score,
            weightPercentage: req.body.weight_percentage
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

async function deleteExamById(req, res, next) {
    try {
        const result = await examService.deleteExamById(Number(req.params.id), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getExams,
    getExamById,
    createExam,
    updateExam,
    deleteExamById
};