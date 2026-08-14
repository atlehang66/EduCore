const paymentMethodRepository = require("../repositories/paymentMethod.repository");

async function getAllPaymentMethods(schoolId) {
    const rows = await paymentMethodRepository.findAllPaymentMethods(schoolId);
    return { success: true, statusCode: 200, data: { payment_methods: rows } };
}

async function getPaymentMethodById(id, schoolId) {
    const pm = await paymentMethodRepository.findPaymentMethodById(id, schoolId);
    if (!pm) return { success: false, statusCode: 404, message: "Payment method not found" };
    return { success: true, statusCode: 200, data: { payment_method: pm } };
}

async function createPaymentMethod(schoolId, { name, provider, details, is_active }) {
    if (!name) return { success: false, statusCode: 400, message: "name is required" };
    // duplicate
    const existing = await paymentMethodRepository.findPaymentMethodByName(name, schoolId);
    if (existing) return { success: false, statusCode: 409, message: "Payment method with this name already exists" };

    const id = await paymentMethodRepository.createPaymentMethod({ schoolId, name, provider, details, isActive: is_active === undefined ? true : !!is_active });
    const created = await paymentMethodRepository.findPaymentMethodById(id, schoolId);
    return { success: true, statusCode: 201, data: { payment_method: created } };
}

async function updatePaymentMethod(id, schoolId, { name, provider, details, is_active }) {
    const existing = await paymentMethodRepository.findPaymentMethodById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Payment method not found" };
    // if changing name, ensure no duplicate
    if (name && name !== existing.name) {
        const other = await paymentMethodRepository.findPaymentMethodByName(name, schoolId);
        if (other) return { success: false, statusCode: 409, message: "Another payment method with this name exists" };
    }
    await paymentMethodRepository.updatePaymentMethod(id, schoolId, { name: name || existing.name, provider, details, isActive: is_active === undefined ? !!existing.is_active : !!is_active });
    const updated = await paymentMethodRepository.findPaymentMethodById(id, schoolId);
    return { success: true, statusCode: 200, data: { payment_method: updated } };
}

async function deletePaymentMethod(id, schoolId) {
    const existing = await paymentMethodRepository.findPaymentMethodById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Payment method not found" };
    // check dependent payments
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM payments WHERE payment_method_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete payment method with existing payments" };

    await paymentMethodRepository.deletePaymentMethod(id, schoolId);
    return { success: true, statusCode: 200, message: "Payment method deleted successfully" };
}

module.exports = {
    getAllPaymentMethods,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
};