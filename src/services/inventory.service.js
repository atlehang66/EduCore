const inventoryRepository = require("../repositories/inventory.repository");

async function getAllInventory(schoolId) {
    const rows = await inventoryRepository.findAllInventory(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            inventory: rows
        }
    };
}

async function getInventoryById(id, schoolId) {
    const item = await inventoryRepository.findInventoryById(
        id,
        schoolId
    );

    if (!item) {
        return {
            success: false,
            statusCode: 404,
            message: "Inventory item not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            inventory_item: item
        }
    };
}

async function createInventory(
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
    if (!itemName) {
        return {
            success: false,
            statusCode: 400,
            message: "itemName is required"
        };
    }

    const id = await inventoryRepository.createInventory({
        schoolId,
        itemName,
        category,
        quantity,
        unit,
        reorderLevel,
        location
    });

    const created = await inventoryRepository.findInventoryById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            inventory_item: created
        }
    };
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
    const existing = await inventoryRepository.findInventoryById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Inventory item not found"
        };
    }

    await inventoryRepository.updateInventory(
        id,
        schoolId,
        {
            itemName: itemName ?? existing.item_name,
            category: category ?? existing.category,
            quantity: quantity ?? existing.quantity,
            unit: unit ?? existing.unit,
            reorderLevel: reorderLevel ?? existing.reorder_level,
            location: location ?? existing.location
        }
    );

    const updated = await inventoryRepository.findInventoryById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            inventory_item: updated
        }
    };
}

async function deleteInventory(id, schoolId) {
    const existing = await inventoryRepository.findInventoryById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Inventory item not found"
        };
    }

    await inventoryRepository.deleteInventory(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Inventory item deleted successfully"
    };
}

module.exports = {
    getAllInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
};