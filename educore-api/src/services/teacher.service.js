const teacherRepository = require("../repositories/teacher.repository");

async function getAllTeachers(schoolId) {
    const teachers =
        await teacherRepository.findAllTeachers(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            teachers
        }
    };
}
async function getTeacherById(teacherId, schoolId) {
    const teacher =
        await teacherRepository.findTeacherById(
            teacherId,
            schoolId
        );

    if (!teacher) {
        return {
            success: false,
            statusCode: 404,
            message: "Teacher not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            teacher
        }
    };
}
async function createTeacher({
    schoolId,
    userId,
    staffNumber,
    firstName,
    lastName,
    email,
    phone,
    hireDate,
    specialization,
    employmentStatus
}) {
    if (!staffNumber || !firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "staff_number, first_name and last_name are required"
        };
    }

    const teacherId =
        await teacherRepository.createTeacher({
            schoolId,
            userId,
            staffNumber,
            firstName,
            lastName,
            email,
            phone,
            hireDate,
            specialization,
            employmentStatus
        });

    const teacher =
        await teacherRepository.findTeacherById(
            teacherId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            teacher
        }
    };
}
async function updateTeacher(
    teacherId,
    schoolId,
    {
        userId,
        staffNumber,
        firstName,
        lastName,
        email,
        phone,
        hireDate,
        specialization,
        employmentStatus
    }
) {
    const existingTeacher =
        await teacherRepository.findTeacherById(
            teacherId,
            schoolId
        );

    if (!existingTeacher) {
        return {
            success: false,
            statusCode: 404,
            message: "Teacher not found"
        };
    }

    if (!staffNumber || !firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "staff_number, first_name and last_name are required"
        };
    }

    await teacherRepository.updateTeacher(
        teacherId,
        schoolId,
        {
            userId,
            staffNumber,
            firstName,
            lastName,
            email,
            phone,
            hireDate,
            specialization,
            employmentStatus
        }
    );

    const teacher =
        await teacherRepository.findTeacherById(
            teacherId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            teacher
        }
    };
}
async function deleteTeacherById(teacherId, schoolId) {
    const existingTeacher =
        await teacherRepository.findTeacherById(
            teacherId,
            schoolId
        );

    if (!existingTeacher) {
        return {
            success: false,
            statusCode: 404,
            message: "Teacher not found"
        };
    }

    await teacherRepository.deleteTeacher(
        teacherId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Teacher deleted successfully"
    };
}

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacherById
};