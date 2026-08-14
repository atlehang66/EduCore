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
        const result = await examService.getExamById(req.params.id, req.user.school_id);
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
            termId: req.body.term_id,
            schoolId: req.user.school_id,
            subjectId: req.body.subject_id,
            classId: req.body.class_id,
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
        const result = await examService.updateExam(req.params.id, req.user.school_id, {
            termId: req.body.term_id,
            subjectId: req.body.subject_id,
            classId: req.body.class_id,
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
        const result = await examService.deleteExamById(req.params.id, req.user.school_id);
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