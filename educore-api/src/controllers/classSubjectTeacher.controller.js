const classSubjectTeacherService = require("../services/classSubjectTeacher.service");

async function getTeachers(req, res, next) {
    try {
        const { classId, subjectId } = req.params;
        const result = await classSubjectTeacherService.getTeachersForClassSubject(Number(classId), Number(subjectId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function createAssignment(req, res, next) {
    try {
        const { classId, subjectId } = req.params;
        const { teacher_id, academic_year_id } = req.body;
        const result = await classSubjectTeacherService.createClassSubjectTeacher({
            classId: Number(classId),
            subjectId: Number(subjectId),
            schoolId: req.user.school_id,
            teacherId: Number(teacher_id),
            academicYearId: Number(academic_year_id)
        });

        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function updateAssignment(req, res, next) {
    try {
        const { classId, subjectId, teacherId } = req.params;
        const { academic_year_id } = req.body;
        const result = await classSubjectTeacherService.updateClassSubjectTeacher(
            Number(classId),
            Number(subjectId),
            Number(teacherId),
            req.user.school_id,
            { academicYearId: Number(academic_year_id) }
        );
        return res.status(result.statusCode).json({ success: result.success, ...(result.data ? { data: result.data } : {}), ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

async function deleteAssignment(req, res, next) {
    try {
        const { classId, subjectId, teacherId } = req.params;
        const result = await classSubjectTeacherService.deleteClassSubjectTeacher(Number(classId), Number(subjectId), Number(teacherId), req.user.school_id);
        return res.status(result.statusCode).json({ success: result.success, ...(result.message ? { message: result.message } : {}) });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTeachers,
    createAssignment,
    updateAssignment,
    deleteAssignment
};