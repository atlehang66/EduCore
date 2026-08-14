const settingService = require("../services/setting.service");

async function getSettings(req, res, next) {
    try {
        const result = await settingService.getAllSettings(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getSettingById(req, res, next) {
    try {
        const result = await settingService.getSettingById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createSetting(req, res, next) {
    try {
        const { key, value, description } = req.body;
        const result = await settingService.createSetting({ schoolId: req.user.school_id, key, value, description });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateSetting(req, res, next) {
    try {
        const { key, value, description } = req.body;
        const result = await settingService.updateSetting(req.params.id, req.user.school_id, { key, value, description });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteSetting(req, res, next) {
    try {
        const result = await settingService.deleteSetting(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getSettings,
    getSettingById,
    createSetting,
    updateSetting,
    deleteSetting
};