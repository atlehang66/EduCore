const assignmentRepository =
    require("../repositories/assignment.repository");

const classRepository =
    require("../repositories/class.repository");

const subjectRepository =
    require("../repositories/subject.repository");

const teacherRepository =
    require("../repositories/teacher.repository");
async function getAllAssignments(schoolId) {
    const assignments =
        await assignmentRepository.findAllAssignments(
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            assignments
        }
    };
}
async function getAssignmentById(
    assignmentId,
    schoolId
) {
    const assignment =
        await assignmentRepository.findAssignmentById(
            assignmentId,
            schoolId
        );

    if (!assignment) {
        return {
            success: false,
            statusCode: 404,
            message: "Assignment not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            assignment
        }
    };
}
async function createAssignment({
    schoolId,
    classId,
    subjectId,
    teacherId,
    title,
    description,
    dueDate,
    maxScore
}) {
    if (!classId || !subjectId || !teacherId || !title) {
        return {
            success: false,
            statusCode: 400,
            message:
                "class_id, subject_id, teacher_id and title are required"
        };
    }

    // Validate class
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

    // Validate subject
    const subject =
        await subjectRepository.findSubjectById(
            subjectId,
            schoolId
        );

    if (!subject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

    // Validate teacher
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

    // Validate max score
    if (
        maxScore !== undefined &&
        (Number(maxScore) <= 0 || Number(maxScore) > 9999.99)
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "max_score must be between 0 and 9999.99"
        };
    }

    const assignmentId =
        await assignmentRepository.createAssignment({
            schoolId,
            classId,
            subjectId,
            teacherId,
            title,
            description,
            dueDate,
            maxScore
        });

    const assignment =
        await assignmentRepository.findAssignmentById(
            assignmentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 201,
        data: {
            assignment
        }
    };
}
async function updateAssignment(
    assignmentId,
    schoolId,
    {
        classId,
        subjectId,
        teacherId,
        title,
        description,
        dueDate,
        maxScore
    }
) {
    const existingAssignment =
        await assignmentRepository.findAssignmentById(
            assignmentId,
            schoolId
        );

    if (!existingAssignment) {
        return {
            success: false,
            statusCode: 404,
            message: "Assignment not found"
        };
    }

    if (!classId || !subjectId || !teacherId || !title) {
        return {
            success: false,
            statusCode: 400,
            message:
                "class_id, subject_id, teacher_id and title are required"
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

    const subject =
        await subjectRepository.findSubjectById(
            subjectId,
            schoolId
        );

    if (!subject) {
        return {
            success: false,
            statusCode: 404,
            message: "Subject not found"
        };
    }

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

    if (
        maxScore !== undefined &&
        (Number(maxScore) <= 0 || Number(maxScore) > 9999.99)
    ) {
        return {
            success: false,
            statusCode: 400,
            message: "max_score must be between 0 and 9999.99"
        };
    }

    await assignmentRepository.updateAssignment(
        assignmentId,
        schoolId,
        {
            classId,
            subjectId,
            teacherId,
            title,
            description,
            dueDate,
            maxScore
        }
    );

    const assignment =
        await assignmentRepository.findAssignmentById(
            assignmentId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            assignment
        }
    };
}
async function deleteAssignmentById(
    assignmentId,
    schoolId
) {
    const existingAssignment =
        await assignmentRepository.findAssignmentById(
            assignmentId,
            schoolId
        );

    if (!existingAssignment) {
        return {
            success: false,
            statusCode: 404,
            message: "Assignment not found"
        };
    }

    await assignmentRepository.deleteAssignment(
        assignmentId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Assignment deleted successfully"
    };
}
module.exports = {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignmentById
};