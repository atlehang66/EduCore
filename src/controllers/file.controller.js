const fileService = require("../services/file.service");

async function getFiles(req, res, next) {
    try {
        const result = await fileService.getAllFiles(req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, data: result.data });
    } catch (error) {
        next(error);
    }
}

async function getFileById(req, res, next) {
    try {
        const result = await fileService.getFileById(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createFile(req, res, next) {
    try {
        const { filename, path, mime_type, size, uploaded_by, uploaded_at } = req.body;
        const result = await fileService.createFile(req.user.school_id, { filename, path, mime_type, size, uploaded_by, uploaded_at });
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(!result.success ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteFile(req, res, next) {
    try {
        const result = await fileService.deleteFile(req.params.id, req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, message: result.message });
    } catch (error) {
        next(error);
    }
}

module.exports = { getFiles, getFileById, createFile, deleteFile };