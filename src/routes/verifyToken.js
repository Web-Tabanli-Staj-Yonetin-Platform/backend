const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';



function verifyToken(req, res, next) {
    const token = req.cookies.authToken; // İstekteki Authorization başlığından token alınır

    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.creater= decoded._id; // Token içinden creater bilgisi alınır ve isteğe eklenir
        next();
    });
};
    module.exports = verifyToken;