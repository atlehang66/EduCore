const assetService = require("../services/asset.service");

async function getAssets(req, res, next) {
    try {
        const result = await assetService.getAllAssets(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getAssetById(req, res, next) {
    try {
        const result = await assetService.getAssetById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createAsset(req, res, next) {
    try {
        const { name, description, value, location, status } = req.body;
        const result = await assetService.createAsset(req.user.school_id, { name, description, value, location, status });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateAsset(req, res, next) {
    try {
        const payload = req.body;
        const result = await assetService.updateAsset(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteAsset(req, res, next) {
    try {
        const result = await assetService.deleteAsset(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getAssets, getAssetById, createAsset, updateAsset, deleteAsset };