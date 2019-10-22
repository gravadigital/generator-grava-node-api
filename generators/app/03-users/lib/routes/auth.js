'use strict';
const express = require('express');
const router = express.Router();
const {User} = require('../models');
const logger = require('../logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function validation(req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'Missing params',
            code: 'missing_params'
        });
    }
    return next();
}

router.post('/login', validation, (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    User.findOne({email: req.body.email})
        .then((user) => {
            if (!user || !user.validPassword(req.body.password)) {
                return res.status(400).json({
                    message: 'Authentication failed!',
                    code: 'authentication_failed'
                });
            }
            const token = jwt.sign(
                user.toToken(),
                JWT_SECRET,
                {expiresIn: '1d'}
            );
            return res.status(200).json({token});
        })
        .catch((error) => {
            logger.error(`findUserError: ${error.message}`);
            return res.status(400).json({
                message: 'Authentication error',
                code: 'authentication_failed'
            });
        });
});

module.exports = router;
