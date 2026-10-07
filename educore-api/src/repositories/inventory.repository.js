const pool = require("../config/database");

async function findAllInventory(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            inventory_id,
            school_id,
            item_name,
            category,
            quantity,
            unit,
            reorder_level,
            location
        FROM inventory
        WHERE school_id = ?
        ORDER BY inventory_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findInventoryById(id, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            inventory_id,
            school_id,
            item_name,
            category,
            quantity,
            unit,
            reorder_level,
            location
        FROM inventory
        WHERE inventory_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [id, schoolId]
    );

    return rows[0] || null;
}

async function createInventory({
    schoolId,
    itemName,
    category,
    quantity,
    unit,
    reorderLevel,
    location
}) {
    const [result] = await pool.query(
        `
        INSERT INTO inventory (
            school_id,
            item_name,
            category,
            quantity,
            unit,
            reorder_level,
            location
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            itemName,
            category || null,
            quantity ?? 0,
            unit || null,
            reorderLevel ?? 0,
            location || null
        ]
    );

    return result.insertId;
}

async function updateInventory(
    id,
    schoolId,
    {
        itemName,
        category,
        quantity,
        unit,
        reorderLevel,
        location
    }
) {
    const [result] = await pool.query(
        `
        UPDATE inventory
        SET
            item_name = ?,
            category = ?,
            quantity = ?,
            unit = ?,
            reorder_level = ?,
            location = ?
        WHERE inventory_id = ?
          AND school_id = ?
        `,
        [
            itemName,
            category || null,
            quantity ?? 0,
            unit || null,
            reorderLevel ?? 0,
            location || null,
            id,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteInventory(id, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM inventory
        WHERE inventory_id = ?
          AND school_id = ?
        `,
        [id, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllInventory,
    findInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
};