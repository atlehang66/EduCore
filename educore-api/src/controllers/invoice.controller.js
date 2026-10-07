const invoiceService = require("../services/invoice.service");

async function getInvoices(req, res, next) {
    try {
        const result = await invoiceService.getAllInvoices(
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            data: result.data
        });
    } catch (error) {
        next(error);
    }
}

async function getInvoiceById(req, res, next) {
    try {
        const result = await invoiceService.getInvoiceById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function createInvoice(req, res, next) {
    try {
        const result = await invoiceService.createInvoice({
            ...req.body,
            school_id: req.user.school_id
        });

        return res.status(201).json({
            success: true,
            data: {
                invoice_id: result
            }
        });
    } catch (error) {
        next(error);
    }
}

async function updateInvoice(req, res, next) {
    try {
        const result = await invoiceService.updateInvoice(
            req.params.id,
            req.user.school_id,
            req.body
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

async function deleteInvoice(req, res, next) {
    try {
        const result = await invoiceService.deleteInvoice(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice
};