const invoiceRepository = require("../repositories/invoice.repository");

// try to load student repository to validate FK; if missing, skip strict validation
let studentRepository = null;
try {
    studentRepository = require("../repositories/student.repository");
} catch (e) {
    // student repository not available in this environment; continue without cross-check
}

async function getAllInvoices(schoolId) {
    const rows = await invoiceRepository.findAllInvoices(schoolId);
    return { success: true, statusCode: 200, data: { invoices: rows } };
}

async function getInvoiceById(id, schoolId) {
    const inv = await invoiceRepository.findInvoiceById(id, schoolId);
    if (!inv) return { success: false, statusCode: 404, message: "Invoice not found" };
    return { success: true, statusCode: 200, data: { invoice: inv } };
}

async function createInvoice(schoolId, { student_id, amount, status, due_date, issued_at }) {
    if (!student_id) return { success: false, statusCode: 400, message: "student_id is required" };
    if (amount === undefined || amount === null) return { success: false, statusCode: 400, message: "amount is required" };

    if (studentRepository) {
        const student = await studentRepository.findStudentById(student_id, schoolId);
        if (!student) return { success: false, statusCode: 404, message: "Student not found" };
    }

    const id = await invoiceRepository.createInvoice({ schoolId, studentId: student_id, amount, status, dueDate: due_date, issuedAt: issued_at });
    const created = await invoiceRepository.findInvoiceById(id, schoolId);
    return { success: true, statusCode: 201, data: { invoice: created } };
}

async function updateInvoice(id, schoolId, { student_id, amount, status, due_date, issued_at }) {
    const existing = await invoiceRepository.findInvoiceById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Invoice not found" };

    if (student_id && studentRepository) {
        const student = await studentRepository.findStudentById(student_id, schoolId);
        if (!student) return { success: false, statusCode: 404, message: "Student not found" };
    }

    await invoiceRepository.updateInvoice(id, schoolId, { studentId: student_id || existing.student_id, amount: amount === undefined ? existing.amount : amount, status: status || existing.status, dueDate: due_date || existing.due_date, issuedAt: issued_at || existing.issued_at });
    const updated = await invoiceRepository.findInvoiceById(id, schoolId);
    return { success: true, statusCode: 200, data: { invoice: updated } };
}

async function deleteInvoice(id, schoolId) {
    const existing = await invoiceRepository.findInvoiceById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Invoice not found" };

    // ensure no payments exist for this invoice
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM payments WHERE invoice_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete invoice with existing payments" };

    await invoiceRepository.deleteInvoice(id, schoolId);
    return { success: true, statusCode: 200, message: "Invoice deleted successfully" };
}

module.exports = {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
};