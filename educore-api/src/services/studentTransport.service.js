const repo = require("../repositories/studentTransport.repository");

async function getAllStudentTransport(schoolId) {
    const rows = await repo.findAllStudentTransport(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            studentTransports: rows
        }
    };
}

async function getStudentTransportById(
    studentId,
    transportId,
    schoolId
) {
    const row = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    if (!row) {
        return {
            success: false,
            statusCode: 404,
            message: "Student transport not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            studentTransport: row
        }
    };
}

async function createStudentTransport(
    schoolId,
    {
        studentId,
        transportId,
        pickupPoint
    }
) {
    if (!studentId) {
        return {
            success: false,
            statusCode: 400,
            message: "studentId is required"
        };
    }

    if (!transportId) {
        return {
            success: false,
            statusCode: 400,
            message: "transportId is required"
        };
    }

    const existing = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    if (existing) {
        return {
            success: false,
            statusCode: 409,
            message: "Student is already assigned to this transport"
        };
    }

    await repo.createStudentTransport({
        studentId,
        transportId,
        pickupPoint
    });

    const created = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            studentTransport: created
        }
    };
}

async function updateStudentTransport(
    studentId,
    transportId,
    schoolId,
    payload
) {
    const existing = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Student transport not found"
        };
    }

    await repo.updateStudentTransport(
        studentId,
        transportId,
        {
            pickupPoint:
                payload.pickupPoint ??
                existing.pickup_point
        },
        schoolId
    );

    const updated = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            studentTransport: updated
        }
    };
}

async function deleteStudentTransport(
    studentId,
    transportId,
    schoolId
) {
    const existing = await repo.findStudentTransportById(
        studentId,
        transportId,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Student transport not found"
        };
    }

    await repo.deleteStudentTransport(
        studentId,
        transportId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Student transport deleted successfully"
    };
}

module.exports = {
    getAllStudentTransport,
    getStudentTransportById,
    createStudentTransport,
    updateStudentTransport,
    deleteStudentTransport
};