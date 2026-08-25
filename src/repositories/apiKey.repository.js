const pool = require("../config/database");

async function findAllApiKeys(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            api_key_id,
            school_id,
            key_hash,
            name,
            scopes,
            is_active,
            created_at,
            expires_at,
            last_used_at
        FROM api_keys
        WHERE school_id = ?
        ORDER BY created_at DESC
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
            scopes,
            is_active,
            created_at,
            expires_at,
            last_used_at
        FROM api_keys
        WHERE api_key_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [apiKeyId, schoolId]
    );

    return rows[0] || null;
}

async function findApiKeyByKeyHash(keyHash, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            api_key_id,
            school_id,
            name,
            scopes,
            is_active,
            expires_at,
            last_used_at
        FROM api_keys
        WHERE key_hash = ?
          AND school_id = ?
        LIMIT 1
        `,
        [keyHash, schoolId]
    );

    return rows[0] || null;
}

async function createApiKey({
    schoolId,
    name,
    keyHash,
    scopes,
    isActive,
    expiresAt
}) {
    const [result] = await pool.execute(
        `
        INSERT INTO api_keys (
            school_id,
            key_hash,
            name,
            scopes,
            is_active,
            expires_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            keyHash,
            name,
            scopes ? JSON.stringify(scopes) : null,
            isActive ? 1 : 0,
            expiresAt || null
        ]
    );

    return result.insertId;
}

async function updateApiKey(
    apiKeyId,
    schoolId,
    { name, scopes, isActive, expiresAt }
) {
    const [result] = await pool.execute(
        `
        UPDATE api_keys
        SET
            name = ?,
            scopes = ?,
            is_active = ?,
            expires_at = ?
        WHERE api_key_id = ?
          AND school_id = ?
        `,
        [
            name,
            scopes || null,
            isActive ? 1 : 0,
            expiresAt || null,
            apiKeyId,
            schoolId
        ]
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
    findApiKeyByKeyHash,
    createApiKey,
    updateApiKey,
    deleteApiKey
};