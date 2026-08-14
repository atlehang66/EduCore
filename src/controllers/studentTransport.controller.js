const studentTransportService = require("../services/studentTransport.service");

async function getStudentTransports(req, res, next) {
    try {
        const result = await studentTransportService.getAllStudentTransport(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getStudentTransportById(req, res, next) {
    try {
        const result = await studentTransportService.getStudentTransportById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createStudentTransport(req, res, next) {
    try {
        const { student_id, transport_id, pickup_point, dropoff_point, active } = req.body;
        const result = await studentTransportService.createStudentTransport(req.user.school_id, { student_id, transport_id, pickup_point, dropoff_point, active });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateStudentTransport(req, res, next) {
    try {
        const payload = req.body;
        const result = await studentTransportService.updateStudentTransport(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteStudentTransport(req, res, next) {
    try {
        const result = await studentTransportService.deleteStudentTransport(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getStudentTransports, getStudentTransportById, createStudentTransport, updateStudentTransport, deleteStudentTransport };