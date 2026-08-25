const pool = require("../config/database");

async function findAllTransport(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            transport_id,
            school_id,
            route_name,
            vehicle_number,
            driver_name,
            driver_phone,
            capacity
        FROM transport
        WHERE school_id = ?
        ORDER BY transport_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findTransportById(transportId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            transport_id,
            school_id,
            route_name,
            vehicle_number,
            driver_name,
            driver_phone,
            capacity
        FROM transport
        WHERE transport_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [transportId, schoolId]
    );

    return rows[0] || null;
}

async function createTransport({
    schoolId,
    routeName,
    vehicleNumber,
    driverName,
    driverPhone,
    capacity
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO transport (
            school_id,
            route_name,
            vehicle_number,
            driver_name,
            driver_phone,
            capacity
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            routeName,
            vehicleNumber ?? null,
            driverName ?? null,
            driverPhone ?? null,
            capacity ?? null
        ]
    );

    return result.insertId;
}

async function updateTransport(
    transportId,
    schoolId,
    {
        routeName,
        vehicleNumber,
        driverName,
        driverPhone,
        capacity
    }
) {
    const [result] = await pool.execute(
        `
        UPDATE transport
        SET
            route_name = ?,
            vehicle_number = ?,
            driver_name = ?,
            driver_phone = ?,
            capacity = ?
        WHERE transport_id = ?
          AND school_id = ?
        `,
        [
            routeName ?? null,
            vehicleNumber ?? null,
            driverName ?? null,
            driverPhone ?? null,
            capacity ?? null,
            transportId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteTransport(transportId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM transport
        WHERE transport_id = ?
          AND school_id = ?
        `,
        [transportId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllTransport,
    findTransportById,
    createTransport,
    updateTransport,
    deleteTransport
};