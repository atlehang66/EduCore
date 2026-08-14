const discountService = require("../services/discount.service");

async function getDiscounts(req, res, next) {
    try {
        const result = await discountService.getAllDiscounts(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getDiscountById(req, res, next) {
    try {
        const result = await discountService.getDiscountById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createDiscount(req, res, next) {
    try {
        const { name, type, percentage, amount, is_active, starts_at, ends_at } = req.body;
        const result = await discountService.createDiscount(req.user.school_id, { name, type, percentage, amount, is_active, starts_at, ends_at });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateDiscount(req, res, next) {
    try {
        const { name, type, percentage, amount, is_active, starts_at, ends_at } = req.body;
        const result = await discountService.updateDiscount(req.params.id, req.user.school_id, { name, type, percentage, amount, is_active, starts_at, ends_at });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteDiscount(req, res, next) {
    try {
        const result = await discountService.deleteDiscount(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount
};