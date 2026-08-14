const pool = require("../config/database");

async function findAllTransport(schoolId) {
    const [rows] = await pool.query(
        `SELECT transport_id, school_id, name, vehicle_no, capacity, driver_id, route, active, created_at, updated_at FROM transport WHERE school_id = ? ORDER BY transport_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findTransportById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT transport_id, school_id, name, vehicle_no, capacity, driver_id, route, active, created_at, updated_at FROM transport WHERE transport_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function createTransport({ schoolId, name, vehicleNo, capacity, driverId, route, active }) {
    const [result] = await pool.query(
        `INSERT INTO transport (school_id, name, vehicle_no, capacity, driver_id, route, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [schoolId, name, vehicleNo || null, capacity || null, driverId || null, route || null, active ? 1 : 0]
    );
    return result.insertId;
}

async function updateTransport(id, schoolId, { name, vehicleNo, capacity, driverId, route, active }) {
    const [result] = await pool.query(
        `UPDATE transport SET name = ?, vehicle_no = ?, capacity = ?, driver_id = ?, route = ?, active = ? WHERE transport_id = ? AND school_id = ?`,
        [name || null, vehicleNo || null, capacity || null, driverId || null, route || null, active ? 1 : 0, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteTransport(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM transport WHERE transport_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllTransport, findTransportById, createTransport, updateTransport, deleteTransport };