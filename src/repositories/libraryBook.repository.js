const pool = require("../config/database");

async function findAllBooks(schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            book_id,
            school_id,
            isbn,
            title,
            author,
            publisher,
            category,
            total_copies,
            available_copies
        FROM library_books
        WHERE school_id = ?
        ORDER BY book_id DESC
        `,
        [schoolId]
    );

    return rows;
}

async function findBookById(id, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            book_id,
            school_id,
            isbn,
            title,
            author,
            publisher,
            category,
            total_copies,
            available_copies
        FROM library_books
        WHERE book_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [id, schoolId]
    );

    return rows[0] || null;
}
async function findBookByIsbn(isbn, schoolId) {
    const [rows] = await pool.query(
        `
        SELECT
            book_id,
            school_id,
            isbn,
            title,
            author,
            publisher,
            category,
            total_copies,
            available_copies
        FROM library_books
        WHERE isbn = ?
          AND school_id = ?
        LIMIT 1
        `,
        [isbn, schoolId]
    );

    return rows[0] || null;
}
async function createBook({
    schoolId,
    isbn,
    title,
    author,
    publisher,
    category,
    totalCopies,
    availableCopies
}) {
    const [result] = await pool.query(
        `
        INSERT INTO library_books (
            school_id,
            isbn,
            title,
            author,
            publisher,
            category,
            total_copies,
            available_copies
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            schoolId,
            isbn || null,
            title,
            author || null,
            publisher || null,
            category || null,
            totalCopies ?? 1,
            availableCopies ?? totalCopies ?? 1
        ]
    );

    return result.insertId;
}

async function updateBook(
    id,
    schoolId,
    {
        isbn,
        title,
        author,
        publisher,
        category,
        totalCopies,
        availableCopies
    }
) {
    const [result] = await pool.query(
        `
        UPDATE library_books
        SET
            isbn = ?,
            title = ?,
            author = ?,
            publisher = ?,
            category = ?,
            total_copies = ?,
            available_copies = ?
        WHERE book_id = ?
          AND school_id = ?
        `,
        [
            isbn || null,
            title,
            author || null,
            publisher || null,
            category || null,
            totalCopies,
            availableCopies,
            id,
            schoolId
        ]
    );

    return result.affectedRows > 0;
}

async function deleteBook(id, schoolId) {
    const [result] = await pool.query(
        `
        DELETE FROM library_books
        WHERE book_id = ?
          AND school_id = ?
        `,
        [id, schoolId]
    );

    return result.affectedRows > 0;
}

module.exports = {
    findAllBooks,
    findBookById,
    findBookByIsbn,
    createBook,
    updateBook,
    deleteBook
};