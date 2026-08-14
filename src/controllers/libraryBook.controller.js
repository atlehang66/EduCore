const libraryBookService = require("../services/libraryBook.service");

async function getBooks(req, res, next) {
    try {
        const result = await libraryBookService.getAllBooks(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getBookById(req, res, next) {
    try {
        const result = await libraryBookService.getBookById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createBook(req, res, next) {
    try {
        const { title, author, isbn, copies_available, location } = req.body;
        const result = await libraryBookService.createBook(req.user.school_id, { title, author, isbn, copies_available, location });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateBook(req, res, next) {
    try {
        const payload = req.body;
        const result = await libraryBookService.updateBook(req.params.id, req.user.school_id, payload);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteBook(req, res, next) {
    try {
        const result = await libraryBookService.deleteBook(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };