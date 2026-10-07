const staffRepository = require("../repositories/staff.repository");

async function getAllStaff(schoolId) {
    const staff = await staffRepository.findAllStaff(schoolId);

    return {
        success: true,
        statusCode: 200,
        data: {
            staff
        }
    };
}
async function getStaffById(staffId, schoolId) {
    const staff = await staffRepository.findStaffById(
        staffId,
        schoolId
    );

    if (!staff) {
        return {
            success: false,
            statusCode: 404,
            message: "Staff member not found"
        };
    }

    return {
        success: true,
        statusCode: 200,
        data: {
            staff
        }
    };
}
async function createStaff({
    schoolId,
    userId,
    staffNumber,
    firstName,
    lastName,
    position,
    department,
    hireDate,
    employmentStatus
}) {
    if (!staffNumber || !firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "staff_number, first_name and last_name are required"
        };
    }

    const staffId = await staffRepository.createStaff({
        schoolId,
        userId,
        staffNumber,
        firstName,
        lastName,
        position,
        department,
        hireDate,
        employmentStatus
    });

    const staff = await staffRepository.findStaffById(
        staffId,
        schoolId
    );

    return {
        success: true,
        statusCode: 201,
        data: {
            staff
        }
    };
}
async function updateStaff(
    staffId,
    schoolId,
    {
        staffNumber,
        firstName,
        lastName,
        position,
        department,
        hireDate,
        employmentStatus
    }
) {
    const existingStaff =
        await staffRepository.findStaffById(
            staffId,
            schoolId
        );

    if (!existingStaff) {
        return {
            success: false,
            statusCode: 404,
            message: "Staff member not found"
        };
    }

    if (!staffNumber || !firstName || !lastName) {
        return {
            success: false,
            statusCode: 400,
            message: "staff_number, first_name and last_name are required"
        };
    }

    await staffRepository.updateStaff(
        staffId,
        schoolId,
        {
            staffNumber,
            firstName,
            lastName,
            position,
            department,
            hireDate,
            employmentStatus
        }
    );

    const staff =
        await staffRepository.findStaffById(
            staffId,
            schoolId
        );

    return {
        success: true,
        statusCode: 200,
        data: {
            staff
        }
    };
}
async function deleteStaffById(staffId, schoolId) {
    const existingStaff =
        await staffRepository.findStaffById(
            staffId,
            schoolId
        );

    if (!existingStaff) {
        return {
            success: false,
            statusCode: 404,
            message: "Staff member not found"
        };
    }

    await staffRepository.deleteStaff(
        staffId,
        schoolId
    );

    return {
        success: true,
        statusCode: 200,
        message: "Staff deleted successfully"
    };
}

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaffById
};