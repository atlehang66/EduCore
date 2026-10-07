const fileRepository = require("../repositories/file.repository");
const pool = require("../config/database");

async function getAllFiles(schoolId) {
    const rows = await fileRepository.findAllFiles(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            files: rows
        }
    };
}

async function getFileById(id, schoolId) {
    const file = await fileRepository.findFileById(id, schoolId);

    if (!file) {
        return {
            success: false,
            statusCode: 404,
            message: "File not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            file
        }
    };
}

async function createFile(
    schoolId,
    {
        fileName,
        filePath,
        mimeType,
        sizeBytes,
        uploadedBy
    }
) {
    if (!fileName) {
        return {
            success: false,
            statusCode: 400,
            message: "fileName is required"
        };
    }

    if (!filePath) {
        return {
            success: false,
            statusCode: 400,
            message: "filePath is required"
        };
    }

    const fileId = await fileRepository.createFile({
        schoolId,
        fileName,
        filePath,
        mimeType,
        sizeBytes,
        uploadedBy
    });

    const created = await fileRepository.findFileById(
        fileId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            file: created
        }
    };
}

async function updateFile(
    id,
    schoolId,
    {
        fileName,
        filePath,
        mimeType,
        sizeBytes
    }
) {
    const existing = await fileRepository.findFileById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "File not found"
        };
    }

    await fileRepository.updateFile(
        id,
        schoolId,
        {
            fileName: fileName ?? existing.file_name,
            filePath: filePath ?? existing.file_path,
            mimeType: mimeType ?? existing.mime_type,
            sizeBytes: sizeBytes ?? existing.size_bytes
        }
    );

    const updated = await fileRepository.findFileById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            file: updated
        }
    };
}

async function deleteFile(id, schoolId) {
    const existing = await fileRepository.findFileById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "File not found"
        };
    }

    // Prevent deletion when the file is referenced by a document
    const [dependencies] = await pool.query(
        `
        SELECT 1
        FROM documents
        WHERE file_id = ?
        LIMIT 1
        `,
        [id]
    );

    if (dependencies.length > 0) {
        return {
            success: false,
            statusCode: 409,
            message: "Cannot delete file referenced by documents"
        };
    }

    await fileRepository.deleteFile(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "File deleted successfully"
    };
}

module.exports = {
    getAllFiles,
    getFileById,
    createFile,
    updateFile,
    deleteFile
};