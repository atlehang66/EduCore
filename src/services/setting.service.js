const settingRepository = require("../repositories/setting.repository");

async function getAllSettings(schoolId) {
    const settings = await settingRepository.findAllSettings(schoolId);
    return { success: true, statusCode: 200, data: { settings } };
}

async function getSettingById(settingId, schoolId) {
    const s = await settingRepository.findSettingById(settingId, schoolId);
    if (!s) return { success: false, statusCode: 404, message: "Setting not found" };
    return { success: true, statusCode: 200, data: { setting: s } };
}

async function createSetting({ schoolId, key, value, description }) {
    if (!key) return { success: false, statusCode: 400, message: "key is required" };

    // prevent duplicate key for same school
    const existing = await settingRepository.findSettingByKey(key, schoolId);
    if (existing) return { success: false, statusCode: 409, message: "Setting with that key already exists" };

    const settingId = await settingRepository.createSetting({ schoolId, key, value, description });
    const s = await settingRepository.findSettingById(settingId, schoolId);
    return { success: true, statusCode: 201, data: { setting: s } };
}

async function updateSetting(settingId, schoolId, { key, value, description }) {
    const existing = await settingRepository.findSettingById(settingId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Setting not found" };

    if (!key) return { success: false, statusCode: 400, message: "key is required" };

    const duplicate = await settingRepository.findSettingByKey(key, schoolId);
    if (duplicate && duplicate.setting_id !== Number(settingId)) {
        return { success: false, statusCode: 409, message: "Another setting with that key exists" };
    }

    await settingRepository.updateSetting(settingId, schoolId, { key, value, description });
    const s = await settingRepository.findSettingById(settingId, schoolId);
    return { success: true, statusCode: 200, data: { setting: s } };
}

async function deleteSetting(settingId, schoolId) {
    const existing = await settingRepository.findSettingById(settingId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Setting not found" };

    await settingRepository.deleteSetting(settingId, schoolId);
    return { success: true, statusCode: 200, message: "Setting deleted successfully" };
}

module.exports = {
    getAllSettings,
    getSettingById,
    createSetting,
    updateSetting,
    deleteSetting
};