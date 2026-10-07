const gradeService = require("../services/grade.service");

async function getGrades(req, res, next) {
    try {
        const result = await gradeService.getAllGrades(
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

async function getGradeById(req, res, next) {
    try {
        const result = await gradeService.getGradeById(
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

async function createGrade(req, res, next) {
    try {
        const result = await gradeService.createGrade({
            schoolId: req.user.school_id,
            name: req.body.name,
            levelOrder: req.body.level_order
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
async function updateGrade(
    gradeId,
    schoolId,
    {
        name,
        levelOrder
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE grades
        SET
            name = ?,
            level_order = ?
        WHERE grade_id = ?
          AND school_id = ?
        `,
        [
            name,
            levelOrder,
            gradeId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function updateGrade(req, res, next) {
    try {
        const result = await gradeService.updateGrade(
            req.params.id,
            req.user.school_id,
            {
                name: req.body.name,
                levelOrder: req.body.level_order
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
async function deleteGradeById(req, res, next) {
    try {
        const result = await gradeService.deleteGradeById(
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
    getGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGradeById
};

