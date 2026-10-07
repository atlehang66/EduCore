const classSubjectTeacherRepository = require("../repositories/classSubjectTeacher.repository");
const classRepository = require("../repositories/class.repository");
const subjectRepository = require("../repositories/subject.repository");
const teacherRepository = require("../repositories/teacher.repository");
const academicYearRepository = require("../repositories/academicYear.repository");

function hasValidId(value) {
    return Number.isInteger(value) && value > 0;
}

async function getTeachersForClassSubject(classId, subjectId, schoolId) {
    if (!hasValidId(classId) || !hasValidId(subjectId)) {
        return { success: false, statusCode: 404, message: "Class or subject not found" };
    }

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
    if (!hasValidId(classId) || !hasValidId(subjectId)) {
        return { success: false, statusCode: 404, message: "Class or subject not found" };
    }

    if (!hasValidId(teacherId) || !hasValidId(academicYearId)) {
        return {
            success: false,
            statusCode: 400,
            message: "teacher_id and academic_year_id are required"
        };
    }

    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) return { success: false, statusCode: 404, message: "Teacher not found" };

    const academicYear = await academicYearRepository.findAcademicYearById(
        academicYearId,
        schoolId
    );
    if (!academicYear) {
        return { success: false, statusCode: 404, message: "Academic year not found" };
    }

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

async function updateClassSubjectTeacher(
    classId,
    subjectId,
    teacherId,
    schoolId,
    { academicYearId }
) {
    if (!hasValidId(classId) || !hasValidId(subjectId) || !hasValidId(teacherId)) {
        return { success: false, statusCode: 404, message: "Assignment not found" };
    }

    if (!hasValidId(academicYearId)) {
        return {
            success: false,
            statusCode: 400,
            message: "academic_year_id is required"
        };
    }

    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) return { success: false, statusCode: 404, message: "Teacher not found" };

    const academicYear = await academicYearRepository.findAcademicYearById(
        academicYearId,
        schoolId
    );
    if (!academicYear) {
        return { success: false, statusCode: 404, message: "Academic year not found" };
    }

    const existing = await classSubjectTeacherRepository.findClassSubjectTeacher(
        classId,
        subjectId,
        teacherId,
        schoolId
    );
    if (!existing) return { success: false, statusCode: 404, message: "Assignment not found" };

    await classSubjectTeacherRepository.updateClassSubjectTeacher(
        classId,
        subjectId,
        teacherId,
        schoolId,
        { academicYearId }
    );

    const updated = await classSubjectTeacherRepository.findClassSubjectTeacher(
        classId,
        subjectId,
        teacherId,
        schoolId
    );
    return { success: true, statusCode: 200, data: { assignment: updated } };
}

async function deleteClassSubjectTeacher(classId, subjectId, teacherId, schoolId) {
    if (!hasValidId(classId) || !hasValidId(subjectId) || !hasValidId(teacherId)) {
        return { success: false, statusCode: 404, message: "Assignment not found" };
    }

    const cls = await classRepository.findClassById(classId, schoolId);
    if (!cls) return { success: false, statusCode: 404, message: "Class not found" };

    const subject = await subjectRepository.findSubjectById(subjectId, schoolId);
    if (!subject) return { success: false, statusCode: 404, message: "Subject not found" };

    const teacher = await teacherRepository.findTeacherById(teacherId, schoolId);
    if (!teacher) return { success: false, statusCode: 404, message: "Teacher not found" };

    const existing = await classSubjectTeacherRepository.findClassSubjectTeacher(
        classId,
        subjectId,
        teacherId,
        schoolId
    );
    if (!existing) return { success: false, statusCode: 404, message: "Assignment not found" };

    await classSubjectTeacherRepository.deleteClassSubjectTeacher(
        classId,
        subjectId,
        teacherId,
        schoolId
    );

    return { success: true, statusCode: 200, message: "Assignment deleted successfully" };
}

module.exports = {
    getTeachersForClassSubject,
    createClassSubjectTeacher,
    updateClassSubjectTeacher,
    deleteClassSubjectTeacher
};