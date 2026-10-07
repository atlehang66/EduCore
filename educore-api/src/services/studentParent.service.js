const studentParentRepository =
    require("../repositories/studentParent.repository");

const studentRepository =
    require("../repositories/student.repository");

const parentRepository =
    require("../repositories/parent.repository");

async function getStudentParents(studentId, schoolId) {
    const parents =
        await studentParentRepository.findAllParentsByStudent(
            studentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            parents
        }
    };
}
async function createStudentParent({
    studentId,
    schoolId,
    parentId,
    relationshipType,
    isPrimaryContact
}) {
    if (!parentId || !relationshipType) {
        return {
            success: false,
            statusCode: 400,
            message: "parent_id and relationship_type are required"
        };
    }

    const student =
        await studentRepository.findStudentById(
            studentId,
            schoolId
        );

    if (!student) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    const parent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    if (!parent) {
        return {
            success: false,
            statusCode: 404,
            message: "Parent not found"
        };
    }

    try {
        await studentParentRepository.createStudentParent({
            studentId,
            parentId,
            relationshipType,
            isPrimaryContact
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                statusCode: 409,
                message: "Parent is already linked to this student"
            };
        }

        throw error;
    }

    return {
        success: true,
        statusCode: 201,
        data: {
            studentId: Number(studentId),
            parentId: Number(parentId),
            relationshipType,
            isPrimaryContact: !!isPrimaryContact
        }
    };
}
async function updateStudentParent(
    studentId,
    parentId,
    schoolId,
    {
        relationshipType,
        isPrimaryContact
    }
) {
    if (!relationshipType) {
        return {
            success: false,
            statusCode: 400,
            message: "relationship_type is required"
        };
    }

    const student =
        await studentRepository.findStudentById(
            studentId,
            schoolId
        );

    if (!student) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    const parent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    if (!parent) {
        return {
            success: false,
            statusCode: 404,
            message: "Parent not found"
        };
    }

    const existingRelationship =
        await studentParentRepository.findStudentParent(
            studentId,
            parentId
        );

    if (!existingRelationship) {
        return {
            success: false,
            statusCode: 404,
            message: "Student-parent relationship not found"
        };
    }

    await studentParentRepository.updateStudentParent(
        studentId,
        parentId,
        {
            relationshipType,
            isPrimaryContact
        }
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            studentId: Number(studentId),
            parentId: Number(parentId),
            relationshipType,
            isPrimaryContact: !!isPrimaryContact
        }
    };
}
async function deleteStudentParent(
    studentId,
    parentId,
    schoolId
) {
    const student =
        await studentRepository.findStudentById(
            studentId,
            schoolId
        );

    if (!student) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    const parent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    if (!parent) {
        return {
            success: false,
            statusCode: 404,
            message: "Parent not found"
        };
    }

    const relationship =
        await studentParentRepository.findStudentParent(
            studentId,
            parentId
        );

    if (!relationship) {
        return {
            success: false,
            statusCode: 404,
            message: "Student-parent relationship not found"
        };
    }

    await studentParentRepository.deleteStudentParent(
        studentId,
        parentId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Student-parent relationship deleted successfully"
    };
}
module.exports = {
    getStudentParents,
    createStudentParent,
    updateStudentParent,
    deleteStudentParent
};