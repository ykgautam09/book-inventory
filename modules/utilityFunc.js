const {v4} = require('uuid');
const {sign, verify} = require('jsonwebtoken');
const {config} = require('dotenv');

config()
const JWT_SECRET = process.env.JWT_SECRET

// generate user ID using uuid v4
function generateID() {
    return v4();
}

// create jwt token for header signing using payload provided returns JWT token
function createToken(payload) {
    return sign(payload, JWT_SECRET, {
        expiresIn: '1h',
    })
}

// verify token signature in provided token returns payload back
function verifyToken(jwtToken) {
    return verify(jwtToken, JWT_SECRET)
}

module.exports = {generateID, createToken, verifyToken};
