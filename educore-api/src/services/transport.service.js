const repo = require("../repositories/transport.repository");
const transportRepository = require("../repositories/transport.repository");
async function getAllTransport(schoolId) {
    const rows = await repo.findAllTransport(schoolId);
    return { success: true, statusCode: 200, data: { transports: rows } };
}

async function getTransportById(id, schoolId) {
    const t = await repo.findTransportById(id, schoolId);
    if (!t) return { success: false, statusCode: 404, message: "Transport not found" };
    return { success: true, statusCode: 200, data: { transport: t } };
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

    const existing =
        await studentTransportRepository.findStudentTransportById(
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

    await studentTransportRepository.createStudentTransport({
        studentId,
        transportId,
        pickupPoint
    });

    const created =
        await studentTransportRepository.findStudentTransportById(
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

async function updateTransport(id, schoolId, payload) {
    const existing = await transportRepository.findTransportById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Transport not found"
        };
    }

    await transportRepository.updateTransport(
        id,
        schoolId,
        {
            routeName: payload.routeName ?? existing.route_name,
            vehicleNumber:
                payload.vehicleNumber ?? existing.vehicle_number,
            driverName:
                payload.driverName ?? existing.driver_name,
            driverPhone:
                payload.driverPhone ?? existing.driver_phone,
            capacity:
                payload.capacity ?? existing.capacity
        }
    );

    const updated = await transportRepository.findTransportById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            transport: updated
        }
    };
}
async function deleteTransport(id, schoolId) {
    const existing = await repo.findTransportById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Transport not found" };

    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM student_transport WHERE transport_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete transport with assigned students" };

    await repo.deleteTransport(id, schoolId);
    return { success: true, statusCode: 200, message: "Transport deleted successfully" };
}

module.exports = {
    getAllTransport,
    getTransportById,
    createStudentTransport,
    updateTransport,
    deleteTransport
};
