const bcrypt = require("bcryptjs");

async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

module.exports = {
    comparePassword,
    hashPassword
};