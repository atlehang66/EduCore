const repo = require("../repositories/transport.repository");

async function getAllTransport(schoolId) {
    const rows = await repo.findAllTransport(schoolId);
    return { success: true, statusCode: 200, data: { transports: rows } };
}

async function getTransportById(id, schoolId) {
    const t = await repo.findTransportById(id, schoolId);
    if (!t) return { success: false, statusCode: 404, message: "Transport not found" };
    return { success: true, statusCode: 200, data: { transport: t } };
}

async function createTransport(schoolId, { name, vehicle_no, capacity, driver_id, route, active }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };
    const id = await repo.createTransport({
        schoolId,
        name,
        vehicleNo: vehicle_no,
        capacity,
        driverId: driver_id,
        route,
        active: active === undefined ? 1 : (active ? 1 : 0)
    });
    const created = await repo.findTransportById(id, schoolId);
    return { success: true, statusCode: 201, data: { transport: created } };
}

async function updateTransport(id, schoolId, payload) {
    const existing = await repo.findTransportById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Transport not found" };

    await repo.updateTransport(id, schoolId, {
        name: payload.name !== undefined ? payload.name : existing.name,
        vehicleNo: payload.vehicle_no !== undefined ? payload.vehicle_no : existing.vehicle_no,
        capacity: payload.capacity !== undefined ? payload.capacity : existing.capacity,
        driverId: payload.driver_id !== undefined ? payload.driver_id : existing.driver_id,
        route: payload.route !== undefined ? payload.route : existing.route,
        active: payload.active === undefined ? existing.active : (payload.active ? 1 : 0)
    });

    const updated = await repo.findTransportById(id, schoolId);
    return { success: true, statusCode: 200, data: { transport: updated } };
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
    createTransport,
    updateTransport,
    deleteTransport
};
