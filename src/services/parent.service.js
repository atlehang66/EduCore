const parentRepository = require("../repositories/parent.repository");

async function getAllParents(schoolId) {
    const parents =
        await parentRepository.findAllParents(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            parents
        }
    };
}
async function getParentById(parentId, schoolId) {
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

    return {
        success: true,
        statusCode: 200,
        data: {
            parent
        }
    };
}
async function createParent({
    schoolId,
    userId,
    firstName,
    lastName,
    phone,
    email,
    occupation
}) {
    if (!firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "first_name and last_name are required"
        };
    }

    const parentId =
        await parentRepository.createParent({
            schoolId,
            userId,
            firstName,
            lastName,
            phone,
            email,
            occupation
        });

    const parent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            parent
        }
    };
}
async function updateParent(
    parentId,
    schoolId,
    {
        userId,
        firstName,
        lastName,
        phone,
        email,
        occupation
    }
) {
    const existingParent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    if (!existingParent) {
        return {
            success: false,
            statusCode: 404,
            message: "Parent not found"
        };
    }

    if (!firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "first_name and last_name are required"
        };
    }

    await parentRepository.updateParent(
        parentId,
        schoolId,
        {
            userId,
            firstName,
            lastName,
            phone,
            email,
            occupation
        }
    );

    const parent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            parent
        }
    };
}
async function deleteParentById(parentId, schoolId) {
    const existingParent =
        await parentRepository.findParentById(
            parentId,
            schoolId
        );

    if (!existingParent) {
        return {
            success: false,
            statusCode: 404,
            message: "Parent not found"
        };
    }

    await parentRepository.deleteParent(
        parentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Parent deleted successfully"
    };
}
module.exports = {
    getAllParents,
    getParentById,
    createParent,
    updateParent,
    deleteParentById
};