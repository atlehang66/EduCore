const loanRepo = require("../repositories/loan.repository");
const bookRepo = require("../repositories/libraryBook.repository");
const studentRepo = require("../repositories/student.repository");

async function getAllLoans(schoolId) {
    const rows = await loanRepo.findAllLoans(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            loans: rows
        }
    };
}

async function getLoanById(id, schoolId) {
    const loan = await loanRepo.findLoanById(
        id,
        schoolId
    );

    if (!loan) {
        return {
            success: false,
            statusCode: 404,
            message: "Loan not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            loan
        }
    };
}

async function createLoan(
    schoolId,
    {
        bookId,
        studentId,
        staffId,
        borrowedAt,
        dueAt,
        status
    }
) {
    // Book is required
    if (!bookId) {
        return {
            success: false,
            statusCode: 400,
            message: "bookId is required"
        };
    }

    // Either student OR staff must be provided
    if (!studentId && !staffId) {
        return {
            success: false,
            statusCode: 400,
            message: "studentId or staffId is required"
        };
    }

    if (studentId && staffId) {
        return {
            success: false,
            statusCode: 400,
            message: "A loan cannot belong to both a student and staff member"
        };
    }

    if (!dueAt) {
        return {
            success: false,
            statusCode: 400,
            message: "dueAt is required"
        };
    }

    // Check book
    const book = await bookRepo.findBookById(
        bookId,
        schoolId
    );

    if (!book) {
        return {
            success: false,
            statusCode: 404,
            message: "Book not found"
        };
    }

    // Check availability
    if (book.available_copies <= 0) {
        return {
            success: false,
            statusCode: 409,
            message: "No copies of this book are currently available"
        };
    }

    // Check student
    if (studentId) {
        const student = await studentRepo.findStudentById(
            studentId,
            schoolId
        );

        if (!student) {
            return {
                success: false,
                statusCode: 404,
                message: "Student not found"
            };
        }
    }

    const id = await loanRepo.createLoan({
        schoolId,
        bookId,
        studentId,
        staffId,
        borrowedAt,
        dueAt,
        status: status || "on_loan"
    });

    // Decrease available copies
    await bookRepo.updateBook(
        bookId,
        schoolId,
        {
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            category: book.category,
            totalCopies: book.total_copies,
            availableCopies: book.available_copies - 1
        }
    );

    const created = await loanRepo.findLoanById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            loan: created
        }
    };
}

async function updateLoan(
    id,
    schoolId,
    {
        returnedAt,
        status
    }
) {
    const existing = await loanRepo.findLoanById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Loan not found"
        };
    }

    // Only increase availability when a loan is being returned
    const returning =
        status === "returned" &&
        existing.status !== "returned";

    if (returning) {
        const book = await bookRepo.findBookById(
            existing.book_id,
            schoolId
        );

        if (book) {
            await bookRepo.updateBook(
                existing.book_id,
                schoolId,
                {
                    isbn: book.isbn,
                    title: book.title,
                    author: book.author,
                    publisher: book.publisher,
                    category: book.category,
                    totalCopies: book.total_copies,
                    availableCopies: Math.min(
                        book.available_copies + 1,
                        book.total_copies
                    )
                }
            );
        }
    }

    await loanRepo.updateLoan(
        id,
        schoolId,
        {
            bookId: existing.book_id,
            studentId: existing.student_id,
            staffId: existing.staff_id,
            borrowedAt: existing.borrowed_at,
            dueAt: existing.due_at,
            returnedAt: returnedAt || null,
            status: status || existing.status
        }
    );

    const updated = await loanRepo.findLoanById(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            loan: updated
        }
    };
}

async function deleteLoan(id, schoolId) {
    const existing = await loanRepo.findLoanById(
        id,
        schoolId
    );

    if (!existing) {
        return {
            success: false,
            statusCode: 404,
            message: "Loan not found"
        };
    }

    await loanRepo.deleteLoan(
        id,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Loan deleted successfully"
    };
}

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan
};