const classRepository = require("../repositories/class.repository");

async function getAllClasses(schoolId) {
    const classes = await classRepository.findAllClasses(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            classes
        }
    };
}
async function getClassById(classId, schoolId) {
    const classData = await classRepository.findClassById(
        classId,
        schoolId
    );

    if (!classData) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            class: classData
        }
    };
}
async function createClass({
    schoolId,
    gradeId,
    academicYearId,
    name,
    homeroomTeacherId,
    capacity
}) {
    if (!gradeId || !academicYearId || !name) {
        return {
            success: false,
            statusCode: 400,
            message: "grade_id, academic_year_id and name are required"
        };
    }

    const classId = await classRepository.createClass({
        schoolId,
        gradeId,
        academicYearId,
        name,
        homeroomTeacherId,
        capacity
    });

    const classData = await classRepository.findClassById(
        classId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            class: classData
        }
    };
}
async function updateClass(classId, schoolId, data) {
    const existingClass = await classRepository.findClassById(
        classId,
        schoolId
    );

    if (!existingClass) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    if (
        !data.gradeId ||
        !data.academicYearId ||
        !data.name
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "grade_id, academic_year_id and name are required"
        };
    }

    await classRepository.updateClass(
        classId,
        schoolId,
        data
    );

    const classData = await classRepository.findClassById(
        classId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            class: classData
        }
    };
}
async function deleteClassById(classId, schoolId) {
    const existingClass = await classRepository.findClassById(
        classId,
        schoolId
    );

    if (!existingClass) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    await classRepository.deleteClass(
        classId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Class deleted successfully"
    };
}
module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClassById
};