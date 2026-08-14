const apiKeyRepository = require("../repositories/apiKey.repository");
const crypto = require("crypto");

function generateKeyPair() {
    const apiKey = crypto.randomBytes(16).toString("hex");
    const apiSecret = crypto.randomBytes(32).toString("hex");
    return { apiKey, apiSecret };
}

async function getAllApiKeys(schoolId) {
    const keys = await apiKeyRepository.findAllApiKeys(schoolId);
    // Do not expose secrets in lists
    const safe = keys.map(k => ({ ...k, api_secret: undefined, api_key: k.api_key }));
    return { success: true, statusCode: 200, data: { api_keys: safe } };
}

async function getApiKeyById(apiKeyId, schoolId) {
    const key = await apiKeyRepository.findApiKeyById(apiKeyId, schoolId);
    if (!key) return { success: false, statusCode: 404, message: "API key not found" };
    // Do not expose secret
    key.api_secret = undefined;
    return { success: true, statusCode: 200, data: { api_key: key } };
}

async function createApiKey({ schoolId, name, expiresAt, isActive }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };

    // Generate a unique api_key (regenerate up to 5 times if we collide)
    let apiKey = null;
    let apiSecret = null;
    for (let attempt = 0; attempt < 5; attempt++) {
        const pair = generateKeyPair();
        const existing = await apiKeyRepository.findApiKeyByKey(pair.apiKey, schoolId);
        if (!existing) {
            apiKey = pair.apiKey;
            apiSecret = pair.apiSecret;
            break;
        }
    }
    if (!apiKey) {
        return { success: false, statusCode: 500, message: "Failed to generate a unique API key" };
    }

    const apiKeyId = await apiKeyRepository.createApiKey({ schoolId, name, apiKey, apiSecret, isActive: isActive === undefined ? true : !!isActive, expiresAt });

    if (!apiKeyId) {
        return { success: false, statusCode: 500, message: "Failed to create API key" };
    }

    const created = await apiKeyRepository.findApiKeyById(apiKeyId, schoolId);
    // return secret only on creation
    return { success: true, statusCode: 201, data: { api_key: { api_key_id: created.api_key_id, name: created.name, api_key: created.api_key, api_secret: apiSecret, is_active: !!created.is_active, expires_at: created.expires_at } } };
}

async function updateApiKey(apiKeyId, schoolId, { name, apiSecret, isActive, expiresAt }) {
    const existing = await apiKeyRepository.findApiKeyById(apiKeyId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "API key not found" };

    await apiKeyRepository.updateApiKey(apiKeyId, schoolId, { name: name || existing.name, apiSecret, isActive: isActive === undefined ? !!existing.is_active : !!isActive, expiresAt });
    const updated = await apiKeyRepository.findApiKeyById(apiKeyId, schoolId);
    updated.api_secret = undefined;
    return { success: true, statusCode: 200, data: { api_key: updated } };
}

async function deleteApiKey(apiKeyId, schoolId) {
    const existing = await apiKeyRepository.findApiKeyById(apiKeyId, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "API key not found" };

    await apiKeyRepository.deleteApiKey(apiKeyId, schoolId);
    return { success: true, statusCode: 200, message: "API key deleted successfully" };
}

module.exports = {
    getAllApiKeys,
    getApiKeyById,
    createApiKey,
    updateApiKey,
    deleteApiKey
};