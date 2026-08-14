const paymentService = require("../services/payment.service");

async function getPayments(req, res, next) {
    try {
        const result = await paymentService.getAllPayments(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getPaymentById(req, res, next) {
    try {
        const result = await paymentService.getPaymentById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createPayment(req, res, next) {
    try {
        const { invoice_id, payment_method_id, amount, paid_at, reference } = req.body;
        const result = await paymentService.createPayment(req.user.school_id, { invoice_id, payment_method_id, amount, paid_at, reference });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updatePayment(req, res, next) {
    try {
        const { invoice_id, payment_method_id, amount, paid_at, reference } = req.body;
        const result = await paymentService.updatePayment(req.params.id, req.user.school_id, { invoice_id, payment_method_id, amount, paid_at, reference });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deletePayment(req, res, next) {
    try {
        const result = await paymentService.deletePayment(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};