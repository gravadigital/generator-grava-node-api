'use strict';
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {User} = require('@lib/models');
const logger = require('@lib/logger');
const {validateBodyFields} = require('@middlewares/general');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;

function findAndValidateUser(req, res, next) {
    req.body.email = req.body.email.toLowerCase();
    return User.findOne({
        email: req.body.email
    })
        .then((user) => {
            if (!user || !user.validPassword(req.body.password)) {
                return res.status(400).json({
                    message: 'Authentication failed!',
                    code: 'authentication_failed'
                });
            }
            req.user = user;
            return next();
        })
        .catch((error) => {
            logger.error(`POST /auth/login - findAndValidateUser - ${error.message}`);
            return res.status(400).json({
                message: 'Internal error',
                code: 'internal_error'
            });
        });
}

function createAndSendToken(req, res) {
    try {
        const token = jwt.sign(
            req.user.toToken(),
            JWT_SECRET,
            {
                expiresIn: '1d',
                issuer: JWT_ISSUER
            }
        );
        return res.status(200).json({token});
    } catch (error) {
        logger.error(`POST /auth/login - createAndSendToken - ${error.message}`);
        return res.status(500).json({
            message: 'Internal error',
            code: 'internal_error'
        });
    }2
}


/**
 * @name Login
 * @description Authenticate user using email and password
 * @route {POST} /api/auth/login
 * @bodyparam {string} [email] email}
 * @bodyparam {string} [password] password
 * @response {200} OK
 * @responsebody {string} [token] token
 * @response {400} Missing email or password
 * @responsebody {string} [code] missing_params
 * @responsebody {string} [message] Missing params
 * @response {400} Failed authentication due to invalid email or password
 * @responsebody {string} [code] authentication_failed
 * @responsebody {string} [message] Authentication error
 */
router.post(
    '/auth/login',
    validateBodyFields(Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    })),
    findAndValidateUser,
    createAndSendToken
);

module.exports = router;
