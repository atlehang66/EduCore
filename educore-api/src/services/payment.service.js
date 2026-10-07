const paymentRepository = require("../repositories/payment.repository");
let invoiceRepository = null;
let paymentMethodRepository = null;
try {
    invoiceRepository = require("../repositories/invoice.repository");
} catch (e) {}
try {
    paymentMethodRepository = require("../repositories/paymentMethod.repository");
} catch (e) {}

async function getAllPayments(schoolId) {
    const rows = await paymentRepository.findAllPayments(schoolId);
    return { success: true, statusCode: 200, data: { payments: rows } };
}

async function getPaymentById(id, schoolId) {
    const p = await paymentRepository.findPaymentById(id, schoolId);
    if (!p) return { success: false, statusCode: 404, message: "Payment not found" };
    return { success: true, statusCode: 200, data: { payment: p } };
}

async function createPayment(schoolId, { invoice_id, payment_method_id, amount, paid_at, reference }) {
    if (!invoice_id) return { success: false, statusCode: 400, message: "invoice_id is required" };
    if (amount === undefined || amount === null) return { success: false, statusCode: 400, message: "amount is required" };

    if (invoiceRepository) {
        const inv = await invoiceRepository.findInvoiceById(invoice_id, schoolId);
        if (!inv) return { success: false, statusCode: 404, message: "Invoice not found" };
    }
    if (paymentMethodRepository && payment_method_id) {
        const pm = await paymentMethodRepository.findPaymentMethodById(payment_method_id, schoolId);
        if (!pm) return { success: false, statusCode: 404, message: "Payment method not found" };
    }

    const id = await paymentRepository.createPayment({ schoolId, invoiceId: invoice_id, paymentMethodId: payment_method_id, amount, paidAt: paid_at, reference });
    const created = await paymentRepository.findPaymentById(id, schoolId);
    return { success: true, statusCode: 201, data: { payment: created } };
}

async function updatePayment(id, schoolId, { invoice_id, payment_method_id, amount, paid_at, reference }) {
    const existing = await paymentRepository.findPaymentById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Payment not found" };

    if (invoice_id && invoiceRepository) {
        const inv = await invoiceRepository.findInvoiceById(invoice_id, schoolId);
        if (!inv) return { success: false, statusCode: 404, message: "Invoice not found" };
    }
    if (payment_method_id && paymentMethodRepository) {
        const pm = await paymentMethodRepository.findPaymentMethodById(payment_method_id, schoolId);
        if (!pm) return { success: false, statusCode: 404, message: "Payment method not found" };
    }

    await paymentRepository.updatePayment(id, schoolId, { invoiceId: invoice_id || existing.invoice_id, paymentMethodId: payment_method_id || existing.payment_method_id, amount: amount === undefined ? existing.amount : amount, paidAt: paid_at || existing.paid_at, reference: reference || existing.reference });
    const updated = await paymentRepository.findPaymentById(id, schoolId);
    return { success: true, statusCode: 200, data: { payment: updated } };
}

async function deletePayment(id, schoolId) {
    const existing = await paymentRepository.findPaymentById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Payment not found" };
    await paymentRepository.deletePayment(id, schoolId);
    return { success: true, statusCode: 200, message: "Payment deleted successfully" };
}

module.exports = {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};