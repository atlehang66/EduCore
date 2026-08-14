const discountRepository = require("../repositories/discount.repository");

async function getAllDiscounts(schoolId) {
    const rows = await discountRepository.findAllDiscounts(schoolId);
    return { success: true, statusCode: 200, data: { discounts: rows } };
}

async function getDiscountById(id, schoolId) {
    const d = await discountRepository.findDiscountById(id, schoolId);
    if (!d) return { success: false, statusCode: 404, message: "Discount not found" };
    return { success: true, statusCode: 200, data: { discount: d } };
}

async function createDiscount(schoolId, { name, type, percentage, amount, is_active, starts_at, ends_at }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };
    const existing = await discountRepository.findDiscountByName(name, schoolId);
    if (existing) return { success: false, statusCode: 409, message: "Discount with this name already exists" };

    const id = await discountRepository.createDiscount({ schoolId, name, type, percentage, amount, isActive: is_active === undefined ? true : !!is_active, startsAt: starts_at, endsAt: ends_at });
    const created = await discountRepository.findDiscountById(id, schoolId);
    return { success: true, statusCode: 201, data: { discount: created } };
}

async function updateDiscount(id, schoolId, { name, type, percentage, amount, is_active, starts_at, ends_at }) {
    const existing = await discountRepository.findDiscountById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Discount not found" };

    if (name && name !== existing.name) {
        const other = await discountRepository.findDiscountByName(name, schoolId);
        if (other) return { success: false, statusCode: 409, message: "Another discount with this name exists" };
    }

    await discountRepository.updateDiscount(id, schoolId, { name: name || existing.name, type, percentage, amount, isActive: is_active === undefined ? !!existing.is_active : !!is_active, startsAt: starts_at, endsAt: ends_at });
    const updated = await discountRepository.findDiscountById(id, schoolId);
    return { success: true, statusCode: 200, data: { discount: updated } };
}

async function deleteDiscount(id, schoolId) {
    const existing = await discountRepository.findDiscountById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Discount not found" };

    // check dependent invoices
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM invoices WHERE discount_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete discount applied to invoices" };

    await discountRepository.deleteDiscount(id, schoolId);
    return { success: true, statusCode: 200, message: "Discount deleted successfully" };
}

module.exports = {
    getAllDiscounts,
    getDiscountById,
    createDiscount,
    updateDiscount,
    deleteDiscount
};