const transportService = require("../services/transport.service");

async function getTransports(req, res, next) {
    try {
        const result = await transportService.getAllTransport(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getTransportById(req, res, next) {
    try {
        console.log("Transport ID:", req.params.id);
        console.log("School ID:", req.user.school_id);

        const result = await transportService.getTransportById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });

    } catch (error) {
        next(error);
    }
}

async function createTransport(req, res, next) {
    try {
        const {
            routeName,
            vehicleNumber,
            driverName,
            driverPhone,
            capacity
        } = req.body;

        const result = await transportService.createTransport(
            req.user.school_id,
            {
                routeName,
                vehicleNumber,
                driverName,
                driverPhone,
                capacity
            }
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });

    } catch (error) {
        next(error);
    }
}

async function updateTransport(req, res, next) {
    try {
        const payload = req.body;
        const result = await transportService.updateTransport(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteTransport(req, res, next) {
    try {
        const result = await transportService.deleteTransport(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTransports,
    getTransportById,
    createTransport,
    updateTransport,
    deleteTransport
};
