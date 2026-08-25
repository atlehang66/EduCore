const pool = require("../config/database");

async function findAllAssets(schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            school_id,
            asset_tag,
            name,
            category,
            purchase_date,
            purchase_value,
            current_value,
            location,
            asset_condition,
            assigned_to
        FROM assets
        WHERE school_id = ?
        ORDER BY asset_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findAssetById(assetId, schoolId) {
    const [rows] = await pool.execute(
        `
        SELECT
            asset_id,
            school_id,
            asset_tag,
            name,
            category,
            purchase_date,
            purchase_value,
            current_value,
            location,
            asset_condition,
            assigned_to
        FROM assets
        WHERE asset_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [assetId, schoolId]
    );

    return rows[0] || null;
}

async function createAsset(assetData) {
    console.log("REPOSITORY assetData:", assetData);

    const {
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
    } = assetData;

    // rest of function...) {
    if (!name) {
        return {
            success: false,
            statusCode: 400,
            message: "name is required"
        };
    }

    if (!assetTag) {
        return {
            success: false,
            statusCode: 400,
            message: "assetTag is required"
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


async function updateAsset(
    assetId,
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
    const [result] = await pool.execute(
        `
        UPDATE assets
        SET
            asset_tag = ?,
            name = ?,
            category = ?,
            purchase_date = ?,
            purchase_value = ?,
            current_value = ?,
            location = ?,
            asset_condition = ?,
            assigned_to = ?
        WHERE asset_id = ?
          AND school_id = ?
        `,
        [
            assetTag,
            name,
            category ?? null,
            purchaseDate ?? null,
            purchaseValue ?? null,
            currentValue ?? null,
            location ?? null,
            assetCondition ?? "good",
            assignedTo ?? null,
            assetId,
            schoolId
        ]
    );

    return result.affectedRows;
}

async function deleteAsset(assetId, schoolId) {
    const [result] = await pool.execute(
        `
        DELETE FROM assets
        WHERE asset_id = ?
          AND school_id = ?
        `,
        [assetId, schoolId]
    );

    return result.affectedRows;
}

module.exports = {
    findAllAssets,
    findAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};