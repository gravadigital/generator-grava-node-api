'use strict';
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

function getJwt(req) {
    let token;
    if (req.headers.authorization && req.headers.authorization.indexOf('Bearer') !== -1) {
        token = req.headers.authorization.replace('Bearer ', '');
    } else if (req.query && req.query.jwt) {
        token = req.query.jwt;
    }
    return token;
}

function extractJwt(req, res, next) {
    jwt.verify(
        getJwt(req),
        JWT_SECRET,
        {issuer: JWT_ISSUER},
        (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    code: 'unauthorized',
                    message: 'Unauthorized'
                });
            }
            req.decodedToken = decoded;
            return next();
        }
    );
}

module.exports = extractJwt;
