const staffService = require("../services/staff.service");

async function getStaff(req, res, next) {
    try {
        const result = await staffService.getAllStaff(
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
async function getStaffById(req, res, next) {
    try {
        const result = await staffService.getStaffById(
            req.params.id,
            req.user.school_id
        );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data
                ? { data: result.data }
                : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });

    } catch (error) {
        next(error);
    }
}
async function createStaff(req, res, next) {
    try {
        const result = await staffService.createStaff({
            schoolId: req.user.school_id,
            userId: req.body.user_id,
            staffNumber: req.body.staff_number,
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            position: req.body.position,
            department: req.body.department,
            hireDate: req.body.hire_date,
            employmentStatus: req.body.employment_status
        });

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data ? { data: result.data } : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });

    } catch (error) {
        next(error);
    }
}
async function updateStaff(req, res, next) {
    try {
        const result =
            await staffService.updateStaff(
                req.params.id,
                req.user.school_id,
                {
                    staffNumber: req.body.staff_number,
                    firstName: req.body.first_name,
                    lastName: req.body.last_name,
                    position: req.body.position,
                    department: req.body.department,
                    hireDate: req.body.hire_date,
                    employmentStatus:
                        req.body.employment_status
                }
            );

        return res.status(result.statusCode).json({
            success: result.success,
            ...(result.data
                ? { data: result.data }
                : {}),
            ...(!result.success
                ? { message: result.message }
                : {})
        });

    } catch (error) {
        next(error);
    }
}
async function deleteStaffById(req, res, next) {
    try {
        const result =
            await staffService.deleteStaffById(
                req.params.id,
                req.user.school_id
            );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaffById
};