const gradeRepository = require("../repositories/grade.repository");

async function getAllGrades(schoolId) {
    const grades = await gradeRepository.findAllGrades(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            grades
        }
    };
}

async function getGradeById(gradeId, schoolId) {
    const grade = await gradeRepository.findGradeById(
        gradeId,
        schoolId
    );

    if (!grade) {
        return {
            success: false,
            statusCode: 404,
            message: "Grade not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            grade
        }
    };
}

async function createGrade({
    schoolId,
    name,
    levelOrder
}) {
    if (!name || levelOrder === undefined || levelOrder === null) {
        return {
            success: false,
            statusCode: 400,
            message: "name and level_order are required"
        };
    }

    const gradeId = await gradeRepository.createGrade({
        schoolId,
        name,
        levelOrder
    });

    const grade = await gradeRepository.findGradeById(
        gradeId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            grade
        }
    };
}

async function updateGrade(gradeId, schoolId, data) {
    const existingGrade = await gradeRepository.findGradeById(
        gradeId,
        schoolId
    );

    if (!existingGrade) {
        return {
            success: false,
            statusCode: 404,
            message: "Grade not found"
        };
    }

    if (
        !data.name ||
        data.levelOrder === undefined ||
        data.levelOrder === null
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "name and level_order are required"
        };
    }

    await gradeRepository.updateGrade(
        gradeId,
        schoolId,
        data
    );

    const grade = await gradeRepository.findGradeById(
        gradeId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            grade
        }
    };
}
async function deleteGradeById(gradeId, schoolId) {
    const existingGrade = await gradeRepository.findGradeById(
        gradeId,
        schoolId
    );

    if (!existingGrade) {
        return {
            success: false,
            statusCode: 404,
            message: "Grade not found"
        };
    }

    await gradeRepository.deleteGrade(
        gradeId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Grade deleted successfully"
    };
}
module.exports = {
    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGradeById
};