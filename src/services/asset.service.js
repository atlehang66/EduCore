const assetRepository = require("../repositories/asset.repository");

async function getAllAssets(schoolId) {
    const rows = await assetRepository.findAllAssets(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            assets: rows
        }
    };
}

async function getAssetById(id, schoolId) {
    const asset = await assetRepository.findAssetById(id, schoolId);

    if (!asset) {
        return {
            success: false,
            statusCode: 404,
            message: "Asset not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            asset
        }
    };
}

async function createAsset(
    schoolId,
    {
        assetTag,
        name,
        category,
        purchaseDate,
        purchaseValue,
        currentValue,
        location,
        assetCondition,
        assignedTo
    }
) {
    if (!assetTag) {
        return {
            success: false,
            statusCode: 400,
            message: "assetTag is required"
        };
    }

    if (!name) {
        return {
            success: false,
            statusCode: 400,
            message: "name is required"
        };
    }

    const id = await assetRepository.createAsset({
        schoolId,
        assetTag,
        name,
        category,
        purchaseDate,
        purchaseValue,
        currentValue,
        location,
        assetCondition,
        assignedTo
    });

    const created = await assetRepository.findAssetById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            asset: created
        }
    };
}

async function updateAsset(id, schoolId, payload) {
    const existing = await assetRepository.findAssetById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Asset not found"
        };
    }

    await assetRepository.updateAsset(
        id,
        schoolId,
        {
            assetTag: payload.assetTag ?? existing.asset_tag,
            name: payload.name ?? existing.name,
            category: payload.category ?? existing.category,
            purchaseDate:
                payload.purchaseDate ?? existing.purchase_date,
            purchaseValue:
                payload.purchaseValue ?? existing.purchase_value,
            currentValue:
                payload.currentValue ?? existing.current_value,
            location:
                payload.location ?? existing.location,
            assetCondition:
                payload.assetCondition ?? existing.asset_condition,
            assignedTo:
                payload.assignedTo ?? existing.assigned_to
        }
    );

    const updated = await assetRepository.findAssetById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            asset: updated
        }
    };
}

async function deleteAsset(id, schoolId) {
    const existing = await assetRepository.findAssetById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Asset not found"
        };
    }

    await assetRepository.deleteAsset(id, schoolId);

    return {
        success: true,
        statusCode: 200,
        message: "Asset deleted successfully"
    };
}

module.exports = {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};