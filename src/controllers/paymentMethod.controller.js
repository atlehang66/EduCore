const paymentMethodService = require("../services/paymentMethod.service");

async function getPaymentMethods(req, res, next) {
    try {
        const result = await paymentMethodService.getAllPaymentMethods(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getPaymentMethodById(req, res, next) {
    try {
        const result = await paymentMethodService.getPaymentMethodById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createPaymentMethod(req, res, next) {
    try {
        const { name, provider, details, is_active } = req.body;
        const result = await paymentMethodService.createPaymentMethod(req.user.school_id, { name, provider, details, is_active });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updatePaymentMethod(req, res, next) {
    try {
        const { name, provider, details, is_active } = req.body;
        const result = await paymentMethodService.updatePaymentMethod(req.params.id, req.user.school_id, { name, provider, details, is_active });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deletePaymentMethod(req, res, next) {
    try {
        const result = await paymentMethodService.deletePaymentMethod(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};