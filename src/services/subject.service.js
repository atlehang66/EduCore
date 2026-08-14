const subjectRepository = require("../repositories/subject.repository");

async function getAllSubjects(schoolId) {
    const subjects = await subjectRepository.findAllSubjects(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            subjects
        }
    };
}
async function getSubjectById(subjectId, schoolId) {
    const subject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    if (!subject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            subject
        }
    };
}
async function createSubject({
    schoolId,
    name,
    code,
    department
}) {
    if (!name || !code) {
        return {
            success: false,
            statusCode: 400,
            message: "name and code are required"
        };
    }

    const subjectId = await subjectRepository.createSubject({
        schoolId,
        name,
        code,
        department
    });

    const subject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            subject
        }
    };
}
async function updateSubject(subjectId, schoolId, data) {
    const existingSubject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    if (!existingSubject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    if (!data.name || !data.code) {
        return {
            success: false,
            statusCode: 400,
            message: "name and code are required"
        };
    }

    await subjectRepository.updateSubject(
        subjectId,
        schoolId,
        data
    );

    const subject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            subject
        }
    };
}
async function deleteSubjectById(subjectId, schoolId) {
    const existingSubject = await subjectRepository.findSubjectById(
        subjectId,
        schoolId
    );

    if (!existingSubject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    await subjectRepository.deleteSubject(
        subjectId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Subject deleted successfully"
    };
}
module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubjectById
};