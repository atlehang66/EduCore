const pool = require("../config/database");

async function findAllSettings(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            setting_id,
            school_id,
            setting_key,
            value,
            updated_at
        FROM settings
        WHERE school_id = ?
        ORDER BY setting_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findSettingById(settingId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            setting_id,
            school_id,
            setting_key,
            value,
            updated_at
        FROM settings
        WHERE setting_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [settingId, schoolId]
    );

    return rows[0] || null;
}

async function findSettingByKey(key, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            setting_id,
            school_id,
            setting_key,
            value,
            updated_at
        FROM settings
        WHERE setting_key = ?
          AND school_id = ?
        LIMIT 1
        `,
        [key, schoolId]
    );

    return rows[0] || null;
}

async function createSetting({ schoolId, key, value }) {
    const [result] = await pool.execute(
        `
        INSERT INTO settings (
            school_id,
            setting_key,
            value
        ) VALUES (?, ?, ?)
        `,
        [schoolId, key, value || null]
    );

    return result.insertId;
}

async function updateSetting(settingId, schoolId, { key, value }) {
    const [result] = await pool.execute(
        `
        UPDATE settings
        SET
            setting_key = ?,
            value = ?
        WHERE setting_id = ?
          AND school_id = ?
        `,
        [key, value || null, settingId, schoolId]
    );

    return result.affectedRows;
}

async function deleteSetting(settingId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM settings
        WHERE setting_id = ?
          AND school_id = ?
        `,
        [settingId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllSettings,
    findSettingById,
    findSettingByKey,
    createSetting,
    updateSetting,
    deleteSetting
};