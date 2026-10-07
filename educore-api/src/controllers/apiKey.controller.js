const apiKeyService = require("../services/apiKey.service");

async function getApiKeys(req, res, next) {
    try {
        const result = await apiKeyService.getAllApiKeys(req.user.school_id);
        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function getApiKeyById(req, res, next) {
    try {
        const result = await apiKeyService.getApiKeyById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createApiKey(req, res, next) {
    try {
        const { name, expires_at, is_active } = req.body;
        const result = await apiKeyService.createApiKey({ schoolId: req.user.school_id, name, expiresAt: expires_at, isActive: is_active });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateApiKey(req, res, next) {
    try {
        const { name, api_secret, is_active, expires_at } = req.body;
        const result = await apiKeyService.updateApiKey(req.params.id, req.user.school_id, { name, apiSecret: api_secret, isActive: is_active, expiresAt: expires_at });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteApiKey(req, res, next) {
    try {
        const result = await apiKeyService.deleteApiKey(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getApiKeys,
    getApiKeyById,
    createApiKey,
    updateApiKey,
    deleteApiKey
};