const assetRepository = require("../repositories/asset.repository");

async function getAllAssets(schoolId) {
    const rows = await assetRepository.findAllAssets(schoolId);
    return { success: true, statusCode: 200, data: { assets: rows } };
}

async function getAssetById(id, schoolId) {
    const asset = await assetRepository.findAssetById(id, schoolId);
    if (!asset) return { success: false, statusCode: 404, message: "Asset not found" };
    return { success: true, statusCode: 200, data: { asset } };
}

async function createAsset(schoolId, { name, description, value, location, status }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };
    const id = await assetRepository.createAsset({ schoolId, name, description, value, location, status });
    const created = await assetRepository.findAssetById(id, schoolId);
    return { success: true, statusCode: 201, data: { asset: created } };
}

async function updateAsset(id, schoolId, payload) {
    const existing = await assetRepository.findAssetById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Asset not found" };
    await assetRepository.updateAsset(id, schoolId, { name: payload.name || existing.name, description: payload.description, value: payload.value, location: payload.location, status: payload.status });
    const updated = await assetRepository.findAssetById(id, schoolId);
    return { success: true, statusCode: 200, data: { asset: updated } };
}

async function deleteAsset(id, schoolId) {
    const existing = await assetRepository.findAssetById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Asset not found" };
    // check dependent inventory or assignments if any
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM inventory WHERE asset_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete asset with inventory records" };

    await assetRepository.deleteAsset(id, schoolId);
    return { success: true, statusCode: 200, message: "Asset deleted successfully" };
}

module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};