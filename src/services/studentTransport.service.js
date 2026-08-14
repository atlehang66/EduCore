const repo = require("../repositories/studentTransport.repository");

async function getAllStudentTransport(schoolId) {
    const rows = await repo.findAllStudentTransport(schoolId);
    return { success: true, statusCode: 200, data: { student_transports: rows } };
}

async function getStudentTransportById(id, schoolId) {
    const row = await repo.findStudentTransportById(id, schoolId);
    if (!row) return { success: false, statusCode: 404, message: "Student transport not found" };
    return { success: true, statusCode: 200, data: { student_transport: row } };
}

async function createStudentTransport(schoolId, { student_id, transport_id, pickup_point, dropoff_point, active }) {
    if (!student_id) return { success: false, statusCode: 400, message: "student_id is required" };
    const id = await repo.createStudentTransport({ schoolId, studentId: student_id, transportId: transport_id, pickupPoint: pickup_point, dropoffPoint: dropoff_point, active: active === undefined ? 1 : (active ? 1 : 0) });
    const created = await repo.findStudentTransportById(id, schoolId);
    return { success: true, statusCode: 201, data: { student_transport: created } };
}

async function updateStudentTransport(id, schoolId, payload) {
    const existing = await repo.findStudentTransportById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Student transport not found" };
    await repo.updateStudentTransport(id, schoolId, { studentId: payload.student_id || existing.student_id, transportId: payload.transport_id || existing.transport_id, pickupPoint: payload.pickup_point, dropoffPoint: payload.dropoff_point, active: payload.active === undefined ? existing.active : payload.active });
    const updated = await repo.findStudentTransportById(id, schoolId);
    return { success: true, statusCode: 200, data: { student_transport: updated } };
}

async function deleteStudentTransport(id, schoolId) {
    const existing = await repo.findStudentTransportById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Student transport not found" };
    await repo.deleteStudentTransport(id, schoolId);
    return { success: true, statusCode: 200, message: "Student transport deleted successfully" };
}

module.exports = { getAllStudentTransport, getStudentTransportById, createStudentTransport, updateStudentTransport, deleteStudentTransport };