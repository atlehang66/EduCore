const authRepository = require("../repositories/auth.repository");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

async function login({
    schoolId,
    email,
    password,
    ipAddress,
    userAgent
}) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findUserByEmailAndSchool(
        normalizedEmail,
        schoolId
    );

    if (!user) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid email or password"
        };
    }

    if (!user.is_active) {
        await authRepository.recordLogin({
            userId: user.user_id,
            schoolId: user.school_id,
            ipAddress,
            userAgent,
            success: false
        });

        return {
            success: false,
            statusCode: 403,
            message: "User account is inactive"
        };
    }

    const passwordValid = await comparePassword(
        password,
        user.password_hash
    );

    if (!passwordValid) {
        await authRepository.recordLogin({
            userId: user.user_id,
            schoolId: user.school_id,
            ipAddress,
            userAgent,
            success: false
        });

        return {
            success: false,
            statusCode: 401,
            message: "Invalid email or password"
        };
    }

    const roles = await authRepository.findUserRoles(user.user_id);

    const permissions =
        await authRepository.findUserPermissions(user.user_id);

    await authRepository.recordLogin({
        userId: user.user_id,
        schoolId: user.school_id,
        ipAddress,
        userAgent,
        success: true
    });

    await authRepository.updateLastLogin(user.user_id);

    const token = generateToken(user);

    return {
        success: true,
        statusCode: 200,
        data: {
            token,
            user: {
                id: user.user_id,
                school_id: user.school_id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                roles,
                permissions
            }
        }
    };
}

module.exports = {
    login
};