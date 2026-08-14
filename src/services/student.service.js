const studentRepository = require("../repositories/student.repository");
const pool = require("../config/database");

async function validateGradeBelongsToSchool(gradeId, schoolId) {
    if (!gradeId) {
        return true;
    }

    const [rows] = await pool.execute(
        `
        SELECT grade_id
        FROM grades
        WHERE grade_id = ?
          AND school_id = ?
        LIMIT 1
        `,
        [gradeId, schoolId]
    );

    return rows.length > 0;
}


async function createStudent({
    schoolId,
    studentNumber,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    enrollmentDate,
    currentGradeId,
    status
}) {
    if (!studentNumber || !firstName || !lastName || !dateOfBirth) {
        return {
            success: false,
            statusCode: 400,
            message: "student_number, first_name, last_name and date_of_birth are required"
        };
    }

    const gradeValid = await validateGradeBelongsToSchool(
        currentGradeId,
        schoolId
    );

    if (!gradeValid) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid current_grade_id for this school"
        };
    }

    const studentId = await studentRepository.createStudent({
        schoolId,
        studentNumber,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        enrollmentDate,
        currentGradeId,
        status
    });

    const student = await studentRepository.findStudentById(
        studentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            student
        }
    };
}


async function getAllStudents(schoolId) {
    const students = await studentRepository.findAllStudents(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            students
        }
    };
}


async function getStudentById(studentId, schoolId) {
    const student = await studentRepository.findStudentById(
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

    return {
        success: true,
        statusCode: 200,
        data: {
            student
        }
    };
}


async function updateStudent(studentId, schoolId, data) {
    const existingStudent = await studentRepository.findStudentById(
        studentId,
        schoolId
    );

    if (!existingStudent) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    if (
        !data.studentNumber ||
        !data.firstName ||
        !data.lastName ||
        !data.dateOfBirth
    ) {
        return {
            success: false,
            statusCode: 400,
            message:
                "student_number, first_name, last_name and date_of_birth are required"
        };
    }

    const gradeValid = await validateGradeBelongsToSchool(
        data.currentGradeId,
        schoolId
    );

    if (!gradeValid) {
        return {
            success: false,
            statusCode: 400,
            message: "Invalid current_grade_id for this school"
        };
    }

    try {
        await studentRepository.updateStudent(
            studentId,
            schoolId,
            data
        );
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return {
                success: false,
                statusCode: 409,
                message: "Student number already exists"
            };
        }

        throw error;
    }

    const student = await studentRepository.findStudentById(
        studentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        data: {
            student
        }
    };
}


async function deleteStudent(studentId, schoolId) {
    const existingStudent = await studentRepository.findStudentById(
        studentId,
        schoolId
    );

    if (!existingStudent) {
        return {
            success: false,
            statusCode: 404,
            message: "Student not found"
        };
    }

    await studentRepository.deleteStudent(
        studentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Student deleted successfully"
    };
}


module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};