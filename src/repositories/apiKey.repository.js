const pool = require("../config/database");

async function findAllApiKeys(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            api_key_id,
            school_id,
            name,
            api_key,
            api_secret,
            is_active,
            expires_at,
            created_at,
            updated_at
        FROM api_keys
        WHERE school_id = ?
        ORDER BY api_key_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findApiKeyById(apiKeyId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            api_key_id,
            school_id,
            name,
            api_key,
            api_secret,
            is_active,
            expires_at,
            created_at,
            updated_at
        FROM api_keys
        WHERE api_key_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [apiKeyId, schoolId]
    );

    return rows[0] || null;
}

async function findApiKeyByKey(apiKeyValue, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT api_key_id FROM api_keys WHERE api_key = ? AND school_id = ? LIMIT 1
        `,
        [apiKeyValue, schoolId]
    );

    return rows[0] || null;
}

async function createApiKey({ schoolId, name, apiKey, apiSecret, isActive, expiresAt }) {
    const [result] = await pool.execute(
        `
        INSERT INTO api_keys (
            school_id,
            name,
            api_key,
            api_secret,
            is_active,
            expires_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        [schoolId, name, apiKey, apiSecret, isActive ? 1 : 0, expiresAt || null]
    );

    return result.insertId;
}

async function updateApiKey(apiKeyId, schoolId, { name, apiSecret, isActive, expiresAt }) {
    const [result] = await pool.execute(
        `
        UPDATE api_keys
        SET
            name = ?,
            api_secret = ?,
            is_active = ?,
            expires_at = ?
        WHERE api_key_id = ?
          AND school_id = ?
        `,
        [name, apiSecret || null, isActive ? 1 : 0, expiresAt || null, apiKeyId, schoolId]
    );

    return result.affectedRows;
}

async function deleteApiKey(apiKeyId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM api_keys
        WHERE api_key_id = ?
          AND school_id = ?
        `,
        [apiKeyId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllApiKeys,
    findApiKeyById,
    findApiKeyByKey,
    createApiKey,
    updateApiKey,
    deleteApiKey
};