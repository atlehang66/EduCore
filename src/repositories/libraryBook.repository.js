const pool = require("../config/database");

async function findAllBooks(schoolId) {
    const [rows] = await pool.query(
        `SELECT book_id, school_id, title, author, isbn, copies_available, location, created_at, updated_at FROM library_books WHERE school_id = ? ORDER BY book_id DESC`,
        [schoolId]
    );
    return rows;
}

async function findBookById(id, schoolId) {
    const [rows] = await pool.query(
        `SELECT book_id, school_id, title, author, isbn, copies_available, location, created_at, updated_at FROM library_books WHERE book_id = ? AND school_id = ? LIMIT 1`,
        [id, schoolId]
    );
    return rows[0] || null;
}

async function findBookByIsbn(isbn, schoolId) {
    const [rows] = await pool.query(`SELECT book_id FROM library_books WHERE isbn = ? AND school_id = ? LIMIT 1`, [isbn, schoolId]);
    return rows[0] || null;
}

async function createBook({ schoolId, title, author, isbn, copiesAvailable, location }) {
    const [result] = await pool.query(
        `INSERT INTO library_books (school_id, title, author, isbn, copies_available, location) VALUES (?, ?, ?, ?, ?, ?)`,
        [schoolId, title, author || null, isbn || null, copiesAvailable || 0, location || null]
    );
    return result.insertId;
}

async function updateBook(id, schoolId, { title, author, isbn, copiesAvailable, location }) {
    const [result] = await pool.query(
        `UPDATE library_books SET title = ?, author = ?, isbn = ?, copies_available = ?, location = ? WHERE book_id = ? AND school_id = ?`,
        [title, author || null, isbn || null, copiesAvailable || 0, location || null, id, schoolId]
    );
    return result.affectedRows > 0;
}

async function deleteBook(id, schoolId) {
    const [result] = await pool.query(
        `DELETE FROM library_books WHERE book_id = ? AND school_id = ?`,
        [id, schoolId]
    );
    return result.affectedRows > 0;
}

module.exports = { findAllBooks, findBookById, findBookByIsbn, createBook, updateBook, deleteBook };