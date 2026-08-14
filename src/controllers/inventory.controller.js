const inventoryService = require("../services/inventory.service");

async function getInventory(req, res, next) {
    try {
        const result = await inventoryService.getAllInventory(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getInventoryById(req, res, next) {
    try {
        const result = await inventoryService.getInventoryById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createInventory(req, res, next) {
    try {
        const { asset_id, quantity, condition_status, location } = req.body;
        const result = await inventoryService.createInventory(req.user.school_id, { asset_id, quantity, condition_status, location });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateInventory(req, res, next) {
    try {
        const payload = req.body;
        const result = await inventoryService.updateInventory(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteInventory(req, res, next) {
    try {
        const result = await inventoryService.deleteInventory(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getInventory, getInventoryById, createInventory, updateInventory, deleteInventory };