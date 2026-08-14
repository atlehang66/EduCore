const loanRepo = require("../repositories/loan.repository");
let bookRepo = null;
let studentRepo = null;
try { bookRepo = require("../repositories/libraryBook.repository"); } catch (e) {}
try { studentRepo = require("../repositories/student.repository"); } catch (e) {}

async function getAllLoans(schoolId) {
    const rows = await loanRepo.findAllLoans(schoolId);
    return { success: true, statusCode: 200, data: { loans: rows } };
}

async function getLoanById(id, schoolId) {
    const row = await loanRepo.findLoanById(id, schoolId);
    if (!row) return { success: false, statusCode: 404, message: "Loan not found" };
    return { success: true, statusCode: 200, data: { loan: row } };
}

async function createLoan(schoolId, { book_id, student_id, loaned_at, due_at }) {
    if (!book_id) return { success: false, statusCode: 400, message: "book_id is required" };
    if (!student_id) return { success: false, statusCode: 400, message: "student_id is required" };
    if (bookRepo) {
        const book = await bookRepo.findBookById(book_id, schoolId);
        if (!book) return { success: false, statusCode: 404, message: "Book not found" };
    }
    if (studentRepo) {
        const student = await studentRepo.findStudentById(student_id, schoolId);
        if (!student) return { success: false, statusCode: 404, message: "Student not found" };
    }
    const id = await loanRepo.createLoan({ schoolId, bookId: book_id, studentId: student_id, loanedAt: loaned_at, dueAt: due_at });
    const created = await loanRepo.findLoanById(id, schoolId);
    return { success: true, statusCode: 201, data: { loan: created } };
}

async function updateLoan(id, schoolId, { returned_at, status }) {
    const existing = await loanRepo.findLoanById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Loan not found" };
    await loanRepo.updateLoan(id, schoolId, { returnedAt: returned_at, status });
    const updated = await loanRepo.findLoanById(id, schoolId);
    return { success: true, statusCode: 200, data: { loan: updated } };
}

async function deleteLoan(id, schoolId) {
    const existing = await loanRepo.findLoanById(id, schoolId);
    if (!existing) return { success: false, statusCode: 404, message: "Loan not found" };
    await loanRepo.deleteLoan(id, schoolId);
    return { success: true, statusCode: 200, message: "Loan deleted successfully" };
}

module.exports = { getAllLoans, getLoanById, createLoan, updateLoan, deleteLoan };