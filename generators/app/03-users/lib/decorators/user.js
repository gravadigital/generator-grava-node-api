'use strict';

function decorator(controller) {
    controller.request('put post delete', (req, res) => {
        return res.status(401).json({
            code: 'unauthorized',
            message: 'Unauthorized'
        });
    });

    controller.request('get', (req, res, next) => {
        if (req.decodedToken.role !== 'admin') {
            return res.status(401).json({
                code: 'unauthorized',
                message: 'Unauthorized'
            });
        }
        return next();
    });
}

module.exports = decorator;
