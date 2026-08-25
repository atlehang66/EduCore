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

async function createInvoice(data) {
    const {
        school_id,
        student_id,
        term_id,
        invoice_number,
        description,
        amount,
        discount_id,
        due_date,
        status
    } = data;

    if (!school_id) {
        throw new Error("school_id is required");
    }

    if (!student_id) {
        throw new Error("student_id is required");
    }

    if (!invoice_number) {
        throw new Error("invoice_number is required");
    }

    if (amount === undefined || amount === null) {
        throw new Error("amount is required");
    }

    return invoiceRepository.createInvoice({
        schoolId: school_id,
        studentId: student_id,
        termId: term_id,
        invoiceNumber: invoice_number,
        description,
        amount,
        discountId: discount_id,
        dueDate: due_date,
        status
    });
}

async function updateInvoice(
    id,
    schoolId,
    {
        student_id,
        term_id,
        invoice_number,
        description,
        amount,
        discount_id,
        due_date,
        status
    }
) {
    const existing = await invoiceRepository.findInvoiceById(id, schoolId);

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Invoice not found"
        };
    }

    if (student_id && studentRepository) {
        const student = await studentRepository.findStudentById(
            student_id,
            schoolId
        );

        if (!student) {
            return {
                success: false,
                statusCode: 404,
                message: "Student not found"
            };
        }
    }

    await invoiceRepository.updateInvoice(
        id,
        schoolId,
        {
            studentId: student_id ?? existing.student_id,
            termId: term_id ?? existing.term_id,
            invoiceNumber: invoice_number ?? existing.invoice_number,
            description: description ?? existing.description,
            amount: amount ?? existing.amount,
            discountId: discount_id ?? existing.discount_id,
            dueDate: due_date ?? existing.due_date,
            status: status ?? existing.status
        }
    );

    const updated = await invoiceRepository.findInvoiceById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            invoice: updated
        }
    };
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