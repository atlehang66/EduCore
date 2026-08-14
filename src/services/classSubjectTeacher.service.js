const classSubjectTeacherRepository = require("../repositories/classSubjectTeacher.repository");
const classRepository = require("../repositories/class.repository");
const subjectRepository = require("../repositories/subject.repository");
const teacherRepository = require("../repositories/teacher.repository");

async function getTeachersForClassSubject(classId, subjectId, schoolId) {
    // Validate class and subject existence and school membership
    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const rows = await classSubjectTeacherRepository.findTeachersByClassSubject(classId, subjectId, schoolId);

    return { success: true, statusCode: 200, data: { teachers: rows } };
}

async function createClassSubjectTeacher({
    schoolId,
    classId,
    subjectId,
    teacherId,
    academicYearId
}) {
    const existing =
        await classSubjectTeacherRepository.findClassSubjectTeacher(
            classId,
            subjectId,
            teacherId,
            schoolId
        );

    if (existing) {
        return {
            success: false,
            statusCode: 409,
            message: "Teacher is already assigned to this class and subject"
        };
    }

    const result =
        await classSubjectTeacherRepository.createClassSubjectTeacher({
            schoolId,
            classId,
            subjectId,
            teacherId,
            academicYearId
        });

    return {
        success: true,
        statusCode: 201,
        data: {
            id: result.insertId
        }
    };
}

async function updateClassSubjectTeacher(classId, subjectId, teacherId, schoolId, { isPrimary }) {
    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) return { success: false, statusCode: 404, message: "Teacher not found" };

    const existing = await classSubjectTeacherRepository.findClassSubjectTeacher(classId, subjectId, teacherId);
    if (!existing) return { success: false, statusCode: 404, message: "Assignment not found" };

    await classSubjectTeacherRepository.updateClassSubjectTeacher(classId, subjectId, teacherId, { isPrimary });

    const updated = await classSubjectTeacherRepository.findClassSubjectTeacher(classId, subjectId, teacherId);
    return { success: true, statusCode: 200, data: { assignment: updated } };
}

async function deleteClassSubjectTeacher(classId, subjectId, teacherId, schoolId) {
    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) return { success: false, statusCode: 404, message: "Teacher not found" };

    const existing = await classSubjectTeacherRepository.findClassSubjectTeacher(classId, subjectId, teacherId);
    if (!existing) return { success: false, statusCode: 404, message: "Assignment not found" };

    await classSubjectTeacherRepository.deleteClassSubjectTeacher(classId, subjectId, teacherId);

    return { success: true, statusCode: 200, message: "Assignment deleted successfully" };
}

module.exports = {
    getTeachersForClassSubject,
    createClassSubjectTeacher,
    updateClassSubjectTeacher,
    deleteClassSubjectTeacher
};