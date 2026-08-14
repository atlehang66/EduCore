const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

function generateToken(user) {
    return jwt.sign(
        {
            sub: user.user_id,
            school_id: user.school_id
        },
        jwtSecret,
        {
            expiresIn: jwtExpiresIn
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}

module.exports = {
    generateToken,
    verifyToken
};