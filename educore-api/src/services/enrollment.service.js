const enrollmentRepository =
    require("../repositories/enrollment.repository");

const studentRepository =
    require("../repositories/student.repository");

const classRepository =
    require("../repositories/class.repository");

const academicYearRepository =
    require("../repositories/academicYear.repository");

const supportedStatuses = [
    "active",
    "transferred",
    "completed",
    "withdrawn"
];

function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

function isValidEnrollmentDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function validateEnrollmentFields({
    studentId,
    classId,
    academicYearId,
    enrollmentDate,
    status
}) {
    if (
        !isPositiveInteger(studentId) ||
        !isPositiveInteger(classId) ||
        !isPositiveInteger(academicYearId)
    ) {
        return "student_id, class_id and academic_year_id must be positive integers";
    }

    if (
        enrollmentDate !== undefined &&
        !isValidEnrollmentDate(enrollmentDate)
    ) {
        return "enrollment_date must be a valid date in YYYY-MM-DD format";
    }

    if (status !== undefined && !supportedStatuses.includes(status)) {
        return `status must be one of: ${supportedStatuses.join(", ")}`;
    }

    return null;
}

async function getAllEnrollments(schoolId) {
    const enrollments =
        await enrollmentRepository.findAllEnrollments(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            enrollments
        }
    };
}
async function getEnrollmentById(enrollmentId, schoolId) {
    if (!isPositiveInteger(enrollmentId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    const enrollment =
        await enrollmentRepository.findEnrollmentById(
            enrollmentId,
            schoolId
        );

    if (!enrollment) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            enrollment
        }
    };
}
async function createEnrollment({
    schoolId,
    studentId,
    classId,
    academicYearId,
    enrollmentDate,
    status
}) {
    const validationError = validateEnrollmentFields({
        studentId,
        classId,
        academicYearId,
        enrollmentDate,
        status
    });

    if (validationError) {
        return {
            success: false,
            statusCode: 400,
            message: validationError
        };
    }

    const student =
        await studentRepository.findStudentById(
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

    const classData =
        await classRepository.findClassById(
            classId,
            schoolId
        );

    if (!classData) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    const academicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    if (!academicYear) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    const existingEnrollment =
        await enrollmentRepository.findExistingEnrollment(
            studentId,
            classId,
            academicYearId,
            schoolId
        );

    if (existingEnrollment) {
        return {
            success: false,
            statusCode: 409,
            message:
                "Student is already enrolled in this class for this academic year"
        };
    }

    const enrollmentId =
        await enrollmentRepository.createEnrollment({
            schoolId,
            studentId,
            classId,
            academicYearId,
            enrollmentDate,
            status
        });

    const enrollment =
        await enrollmentRepository.findEnrollmentById(
            enrollmentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            enrollment
        }
    };
}
async function updateEnrollment(
    enrollmentId,
    schoolId,
    {
        studentId,
        classId,
        academicYearId,
        enrollmentDate,
        status
    }
) {
    if (!isPositiveInteger(enrollmentId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    const validationError = validateEnrollmentFields({
        studentId,
        classId,
        academicYearId,
        enrollmentDate,
        status
    });

    if (validationError) {
        return {
            success: false,
            statusCode: 400,
            message: validationError
        };
    }

    // Check that the enrollment exists
    const existingEnrollment =
        await enrollmentRepository.findEnrollmentById(
            enrollmentId,
            schoolId
        );

    if (!existingEnrollment) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    // Check student
    const student =
        await studentRepository.findStudentById(
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

    // Check class
    const classData =
        await classRepository.findClassById(
            classId,
            schoolId
        );

    if (!classData) {
        return {
            success: false,
            statusCode: 404,
            message: "Class not found"
        };
    }

    // Check academic year
    const academicYear =
        await academicYearRepository.findAcademicYearById(
            academicYearId,
            schoolId
        );

    if (!academicYear) {
        return {
            success: false,
            statusCode: 404,
            message: "Academic year not found"
        };
    }

    // Check for duplicate enrollment.
    // We need to ignore the enrollment we're currently updating.
    const duplicate =
        await enrollmentRepository.findExistingEnrollment(
            studentId,
            classId,
            academicYearId,
            schoolId
        );

    if (
        duplicate &&
        duplicate.enrollment_id !== Number(enrollmentId)
    ) {
        return {
            success: false,
            statusCode: 409,
            message:
                "Student is already enrolled in this class for this academic year"
        };
    }

    await enrollmentRepository.updateEnrollment(
        enrollmentId,
        schoolId,
        {
            studentId,
            classId,
            academicYearId,
            enrollmentDate,
            status
        }
    );

    const enrollment =
        await enrollmentRepository.findEnrollmentById(
            enrollmentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            enrollment
        }
    };
}
async function deleteEnrollmentById(enrollmentId, schoolId) {
    if (!isPositiveInteger(enrollmentId)) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    const existingEnrollment =
        await enrollmentRepository.findEnrollmentById(
            enrollmentId,
            schoolId
        );

    if (!existingEnrollment) {
        return {
            success: false,
            statusCode: 404,
            message: "Enrollment not found"
        };
    }

    await enrollmentRepository.deleteEnrollment(
        enrollmentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Enrollment deleted successfully"
    };
}
module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollmentById        
};