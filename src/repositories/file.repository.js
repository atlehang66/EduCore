const pool = require("../config/database");

async function findAllFiles(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            file_id,
            school_id,
            file_name,
            file_path,
            mime_type,
            size_bytes,
            uploaded_by,
            uploaded_at
        FROM files
        WHERE school_id = ?
        ORDER BY file_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findFileById(id, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            file_id,
            school_id,
            file_name,
            file_path,
            mime_type,
            size_bytes,
            uploaded_by,
            uploaded_at
        FROM files
        WHERE file_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [id, schoolId]
    );

    return rows[0] || null;
}

async function createFile({
    schoolId,
    fileName,
    filePath,
    mimeType,
    sizeBytes,
    uploadedBy
}) {
    const [result] = await pool.query(
        `
        INSERT INTO files (
            school_id,
            file_name,
            file_path,
            mime_type,
            size_bytes,
            uploaded_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            fileName,
            filePath,
            mimeType || null,
            sizeBytes || null,
            uploadedBy || null
        ]
    );

    return result.insertId;
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
    const [result] = await pool.query(
        `
        UPDATE files
        SET
            file_name = ?,
            file_path = ?,
            mime_type = ?,
            size_bytes = ?
        WHERE file_id = ?
          AND school_id = ?
        `,
        [
            fileName,
            filePath,
            mimeType || null,
            sizeBytes || null,
            id,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteFile(id, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM files
        WHERE file_id = ?
          AND school_id = ?
        `,
        [id, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllFiles,
    findFileById,
    createFile,
    updateFile,
    deleteFile
};