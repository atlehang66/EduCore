const loanService = require("../services/loan.service");

async function getLoans(req, res, next) {
    try {
        const result = await loanService.getAllLoans(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getLoanById(req, res, next) {
    try {
        const result = await loanService.getLoanById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createLoan(req, res, next) {
    try {
        const {
            bookId,
            studentId,
            staffId,
            borrowedAt,
            dueAt,
            status
        } = req.body;

        const result = await loanService.createLoan(
            req.user.school_id,
            {
                bookId,
                studentId,
                staffId,
                borrowedAt,
                dueAt,
                status
            }
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });
    } catch (error) {
        next(error);
    }
}

async function updateLoan(req, res, next) {
    try {
        const { returned_at, status } = req.body;
        const result = await loanService.updateLoan(req.params.id, req.user.school_id, { returned_at, status });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteLoan(req, res, next) {
    try {
        const result = await loanService.deleteLoan(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getLoans, getLoanById, createLoan, updateLoan, deleteLoan };