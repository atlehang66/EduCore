const documentRepository = require("../repositories/document.repository");

async function getAllDocuments(schoolId) {
    const rows = await documentRepository.findAllDocuments(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            documents: rows
        }
    };
}

async function getDocumentById(id, schoolId) {
    const doc = await documentRepository.findDocumentById(id, schoolId);

    if (!doc) {
        return {
            success: false,
            statusCode: 404,
            message: "Document not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            document: doc
        }
    };
}

async function createDocument(
    schoolId,
    {
        studentId,
        fileId,
        title,
        category,
        uploadedBy
    }
) {
    if (!title) {
        return {
            success: false,
            statusCode: 400,
            message: "title is required"
        };
    }

    if (!fileId) {
        return {
            success: false,
            statusCode: 400,
            message: "fileId is required"
        };
    }

    const documentId = await documentRepository.createDocument({
        schoolId,
        studentId,
        fileId,
        title,
        category,
        uploadedBy
    });

    const created = await documentRepository.findDocumentById(
        documentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            document: created
        }
    };
}

async function updateDocument(
    id,
    schoolId,
    {
        studentId,
        fileId,
        title,
        category
    }
) {
    const existing = await documentRepository.findDocumentById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Document not found"
        };
    }

    await documentRepository.updateDocument(
        id,
        schoolId,
        {
            studentId: studentId ?? existing.student_id,
            fileId: fileId ?? existing.file_id,
            title: title ?? existing.title,
            category: category ?? existing.category
        }
    );

    const updated = await documentRepository.findDocumentById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            document: updated
        }
    };
}

async function deleteDocument(id, schoolId) {
    const existing = await documentRepository.findDocumentById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Document not found"
        };
    }

    await documentRepository.deleteDocument(id, schoolId);

    return {
        success: true,
        statusCode: 200,
        message: "Document deleted successfully"
    };
}

module.exports = {
    getAllDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};