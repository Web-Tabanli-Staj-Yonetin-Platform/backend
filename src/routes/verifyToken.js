const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';

function verifyToken(req, res, next) {
    const token = req.headers['authorization']; // İstekteki Authorization başlığından token alınır

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.username = decoded.username; // Token içinden kullanıcı adı alınır ve isteğe eklenir
        next();
    });
}
    module.exports = verifyToken;