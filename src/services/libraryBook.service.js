const bookRepo = require("../repositories/libraryBook.repository");
const pool = require("../config/database");

async function getAllBooks(schoolId) {
    const rows = await bookRepo.findAllBooks(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            books: rows
        }
    };
}

async function getBookById(id, schoolId) {
    const book = await bookRepo.findBookById(
        id,
        schoolId
    );

    if (!book) {
        return {
            success: false,
            statusCode: 404,
            message: "Book not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            book
        }
    };
}

async function createBook(
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
    if (!title) {
        return {
            success: false,
            statusCode: 400,
            message: "title is required"
        };
    }

    if (totalCopies !== undefined && totalCopies < 0) {
        return {
            success: false,
            statusCode: 400,
            message: "totalCopies cannot be negative"
        };
    }

    if (availableCopies !== undefined && availableCopies < 0) {
        return {
            success: false,
            statusCode: 400,
            message: "availableCopies cannot be negative"
        };
    }

    const finalTotalCopies = totalCopies ?? 1;
    const finalAvailableCopies =
        availableCopies ?? finalTotalCopies;

    if (finalAvailableCopies > finalTotalCopies) {
        return {
            success: false,
            statusCode: 400,
            message: "availableCopies cannot exceed totalCopies"
        };
    }

    // Prevent duplicate ISBNs within the same school
    if (isbn) {
        const existing = await bookRepo.findBookByIsbn(
            isbn,
            schoolId
        );

        if (existing) {
            return {
                success: false,
                statusCode: 409,
                message: "Book with this ISBN already exists"
            };
        }
    }

    const bookId = await bookRepo.createBook({
        schoolId,
        isbn,
        title,
        author,
        publisher,
        category,
        totalCopies: finalTotalCopies,
        availableCopies: finalAvailableCopies
    });

    const created = await bookRepo.findBookById(
        bookId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            book: created
        }
    };
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
    const existing = await bookRepo.findBookById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Book not found"
        };
    }

    // Check ISBN uniqueness
    if (isbn && isbn !== existing.isbn) {
        const other = await bookRepo.findBookByIsbn(
            isbn,
            schoolId
        );

        if (other) {
            return {
                success: false,
                statusCode: 409,
                message: "Another book with this ISBN exists"
            };
        }
    }

    const finalTotalCopies =
        totalCopies ?? existing.total_copies;

    const finalAvailableCopies =
        availableCopies ?? existing.available_copies;

    if (finalTotalCopies < 0) {
        return {
            success: false,
            statusCode: 400,
            message: "totalCopies cannot be negative"
        };
    }

    if (finalAvailableCopies < 0) {
        return {
            success: false,
            statusCode: 400,
            message: "availableCopies cannot be negative"
        };
    }

    if (finalAvailableCopies > finalTotalCopies) {
        return {
            success: false,
            statusCode: 400,
            message: "availableCopies cannot exceed totalCopies"
        };
    }

    await bookRepo.updateBook(
        id,
        schoolId,
        {
            isbn: isbn ?? existing.isbn,
            title: title ?? existing.title,
            author: author ?? existing.author,
            publisher: publisher ?? existing.publisher,
            category: category ?? existing.category,
            totalCopies: finalTotalCopies,
            availableCopies: finalAvailableCopies
        }
    );

    const updated = await bookRepo.findBookById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            book: updated
        }
    };
}

async function deleteBook(id, schoolId) {
    const existing = await bookRepo.findBookById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Book not found"
        };
    }

    // Prevent deleting books that have loan records
    const [dependencies] = await pool.query(
        `
        SELECT 1
        FROM loans
        WHERE book_id = ?
        LIMIT 1
        `,
        [id]
    );

    if (dependencies.length > 0) {
        return {
            success: false,
            statusCode: 409,
            message: "Cannot delete book with existing loans"
        };
    }

    await bookRepo.deleteBook(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Book deleted successfully"
    };
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};