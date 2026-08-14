const studentService = require("../services/student.service");

async function createStudent(req, res, next) {
    try {
        const result = await studentService.createStudent({
            schoolId: req.user.school_id,
            studentNumber: req.body.student_number,
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            dateOfBirth: req.body.date_of_birth,
            gender: req.body.gender,
            enrollmentDate: req.body.enrollment_date,
            currentGradeId: req.body.current_grade_id,
            status: req.body.status
        });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });

    } catch (error) {
        next(error);
    }
}


async function getStudents(req, res, next) {
    try {
        const result = await studentService.getAllStudents(
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            data: result.data
        });

    } catch (error) {
        next(error);
    }
}


async function getStudent(req, res, next) {
    try {
        const result = await studentService.getStudentById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });

    } catch (error) {
        next(error);
    }
}


async function updateStudent(req, res, next) {
    try {
        const result = await studentService.updateStudent(
            req.params.id,
            req.user.school_id,
            {
                studentNumber: req.body.student_number,
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                dateOfBirth: req.body.date_of_birth,
                gender: req.body.gender,
                enrollmentDate: req.body.enrollment_date,
                currentGradeId: req.body.current_grade_id,
                status: req.body.status
            }
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success ? { message: result.message } : {})
        });

    } catch (error) {
        next(error);
    }
}


async function deleteStudent(req, res, next) {
    try {
        const result = await studentService.deleteStudent(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(!result.success
                ? { message: result.message }
                : { message: result.message })
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
};