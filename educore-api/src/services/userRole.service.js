const userRoleRepository = require("../repositories/userRole.repository");
const authRepository = require("../repositories/auth.repository");
const roleRepository = require("../repositories/role.repository");

async function getRolesForUser(userId, schoolId) {
    const user = await authRepository.findUserById(userId, schoolId);
    if (!user) return { success: false, statusCode: 404, message: "User not found" };

    const roles = await userRoleRepository.findRolesByUser(userId, schoolId);
    return { success: true, statusCode: 200, data: { roles } };
}

async function addRoleToUser({ userId, roleId, schoolId }) {
    if (!userId || !roleId) return { success: false, statusCode: 400, message: "user_id and role_id are required" };

    const user = await authRepository.findUserById(userId, schoolId);
    if (!user) return { success: false, statusCode: 404, message: "User not found" };

    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };

    const existing = await userRoleRepository.findUserRole(userId, roleId);
    if (existing) return { success: false, statusCode: 409, message: "User already has this role" };

    try {
        await userRoleRepository.createUserRole({ userId, roleId });
    } catch (error) {
        if (error && error.code === "ER_DUP_ENTRY") {
            return { success: false, statusCode: 409, message: "User already has this role" };
        }
        throw error;
    }

    return { success: true, statusCode: 201, data: { user_id: Number(userId), role_id: Number(roleId) } };
}

async function removeRoleFromUser(userId, roleId, schoolId) {
    const user = await authRepository.findUserById(userId, schoolId);
    if (!user) return { success: false, statusCode: 404, message: "User not found" };

    const role = await roleRepository.findRoleById(roleId, schoolId);
    if (!role) return { success: false, statusCode: 404, message: "Role not found" };

    const existing = await userRoleRepository.findUserRole(userId, roleId);
    if (!existing) return { success: false, statusCode: 404, message: "Role not assigned to user" };

    await userRoleRepository.deleteUserRole(userId, roleId);
    return { success: true, statusCode: 200, message: "Role removed from user" };
}
// async function putRoleToUser({ userId, roleId, schoolId }) {
//     if (!userId || !roleId) return { success: false, statusCode: 400, message: "user_id and role_id are required" };}
    
module.exports = {
    getRolesForUser,
    addRoleToUser,
    removeRoleFromUser,
    // putRoleToUser
};