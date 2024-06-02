const jwt = require('jsonwebtoken');

function getTestToken() {
    const testUser = {
        id: 'testuser',
        username: 'password'
    };

    return jwt.sign(testUser, 'test_secret_key', { expiresIn: '1h' });
}

module.exports = { getTestToken };