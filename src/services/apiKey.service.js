const apiKeyRepository = require("../repositories/apiKey.repository");
const crypto = require("crypto");

function generateApiKey() {
    return crypto.randomBytes(32).toString("hex");
}

function hashApiKey(apiKey) {
    return crypto
        .createHash("sha256")
        .update(apiKey)
        .digest("hex");
}

async function getAllApiKeys(schoolId) {
    const keys = await apiKeyRepository.findAllApiKeys(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            api_keys: keys
        }
    };
}

async function getApiKeyById(apiKeyId, schoolId) {
    const key = await apiKeyRepository.findApiKeyById(
        apiKeyId,
        schoolId
    );

    if (!key) {
        return {
            success: false,
            statusCode: 404,
            message: "API key not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            api_key: key
        }
    };
}

async function createApiKey({
    schoolId,
    name,
    scopes,
    expiresAt,
    isActive
}) {
    if (!name) {
        return {
            success: false,
            statusCode: 400,
            message: "name is required"
        };
    }

    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);

    const existing = await apiKeyRepository.findApiKeyByKeyHash(
        keyHash,
        schoolId
    );

    if (existing) {
        return {
            success: false,
            statusCode: 500,
            message: "Failed to generate a unique API key"
        };
    }

    const apiKeyId = await apiKeyRepository.createApiKey({
        schoolId,
        name,
        keyHash,
        scopes,
        isActive: isActive === undefined ? true : !!isActive,
        expiresAt
    });

    if (!apiKeyId) {
        return {
            success: false,
            statusCode: 500,
            message: "Failed to create API key"
        };
    }

    return {
        success: true,
        statusCode: 201,
        data: {
            api_key: {
                api_key_id: apiKeyId,
                name,
                api_key: apiKey,
                scopes: scopes || null,
                is_active: isActive === undefined ? true : !!isActive,
                expires_at: expiresAt || null
            }
        }
    };
}

async function updateApiKey(
    apiKeyId,
    schoolId,
    { name, scopes, isActive, expiresAt }
) {
    const existing = await apiKeyRepository.findApiKeyById(
        apiKeyId,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "API key not found"
        };
    }

    await apiKeyRepository.updateApiKey(
        apiKeyId,
        schoolId,
        {
            name: name || existing.name,
            scopes: scopes === undefined
                ? existing.scopes
                : scopes,
            isActive: isActive === undefined
                ? !!existing.is_active
                : !!isActive,
            expiresAt: expiresAt === undefined
                ? existing.expires_at
                : expiresAt
        }
    );

    const updated = await apiKeyRepository.findApiKeyById(
        apiKeyId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            api_key: updated
        }
    };
}

async function deleteApiKey(apiKeyId, schoolId) {
    const existing = await apiKeyRepository.findApiKeyById(
        apiKeyId,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "API key not found"
        };
    }

    await apiKeyRepository.deleteApiKey(
        apiKeyId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "API key deleted successfully"
    };
}

module.exports = {
    getAllApiKeys,
    getApiKeyById,
    createApiKey,
    updateApiKey,
    deleteApiKey
};