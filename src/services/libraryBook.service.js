const bookRepo = require("../repositories/libraryBook.repository");

async function getAllBooks(schoolId) {
    const rows = await bookRepo.findAllBooks(schoolId);
    return { success: true, statusCode: 200, data: { books: rows } };
}

async function getBookById(id, schoolId) {
    const b = await bookRepo.findBookById(id, schoolId);
    if (!b) return { success: false, statusCode: 404, message: "Book not found" };
    return { success: true, statusCode: 200, data: { book: b } };
}

async function createBook(schoolId, { title, author, isbn, copies_available, location }) {
    if (!title) return { success: false, statusCode: 400, message: "title is required" };
    if (isbn) {
        const existing = await bookRepo.findBookByIsbn(isbn, schoolId);
        if (existing) return { success: false, statusCode: 409, message: "Book with this ISBN already exists" };
    }
    const id = await bookRepo.createBook({ schoolId, title, author, isbn, copiesAvailable: copies_available, location });
    const created = await bookRepo.findBookById(id, schoolId);
    return { success: true, statusCode: 201, data: { book: created } };
}

async function updateBook(id, schoolId, payload) {
    const existing = await bookRepo.findBookById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Book not found" };
    if (payload.isbn && payload.isbn !== existing.isbn) {
        const other = await bookRepo.findBookByIsbn(payload.isbn, schoolId);
        if (other) return { success: false, statusCode: 409, message: "Another book with this ISBN exists" };
    }
    await bookRepo.updateBook(id, schoolId, { title: payload.title || existing.title, author: payload.author, isbn: payload.isbn, copiesAvailable: payload.copies_available, location: payload.location });
    const updated = await bookRepo.findBookById(id, schoolId);
    return { success: true, statusCode: 200, data: { book: updated } };
}

async function deleteBook(id, schoolId) {
    const existing = await bookRepo.findBookById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Book not found" };
    // check loans
    const pool = require("../config/database");
    const [deps] = await pool.query(`SELECT 1 FROM loans WHERE book_id = ? LIMIT 1`, [id]);
    if (deps && deps.length > 0) return { success: false, statusCode: 409, message: "Cannot delete book with active loans" };
    await bookRepo.deleteBook(id, schoolId);
    return { success: true, statusCode: 200, message: "Book deleted successfully" };
}

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };