const documentService = require("../services/document.service");

async function getDocuments(req, res, next) {
    try {
        const result = await documentService.getAllDocuments(
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

async function getDocumentById(req, res, next) {
    try {
        const result = await documentService.getDocumentById(
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

async function createDocument(req, res, next) {
    try {
        const {
            studentId,
            fileId,
            title,
            category,
            uploadedBy
        } = req.body;

        const result = await documentService.createDocument(
            req.user.school_id,
            {
                studentId,
                fileId,
                title,
                category,
                uploadedBy: uploadedBy || req.user.user_id
            }
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

async function updateDocument(req, res, next) {
    try {
        const {
            studentId,
            fileId,
            title,
            category
        } = req.body;

        const result = await documentService.updateDocument(
            req.params.id,
            req.user.school_id,
            {
                studentId,
                fileId,
                title,
                category
            }
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

async function deleteDocument(req, res, next) {
    try {
        const result = await documentService.deleteDocument(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(!result.success ? { message: result.message } : {}),
            ...(result.success ? { message: result.message } : {})
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};