'use strict';

function validateBodyFields(validationSchema) {
    return (req, res, next) => {
        const {error} = validationSchema.validate(req.body);
        if (error) {
            const firstError = error.details[0].message;
            return res.status(400).json({
                code: 'invalid_fields',
                message: `Invalid fields - ${firstError}`
            });
        }
        return next();
    };
}

function validateBodyFields(validationSchema) {
    return (req, res, next) => {
        const {error} = validationSchema.validate(req.body);

        if (error) {
            const firstError = error.details[0].message;
            return res.status(400).json({
                code: 'invalid_fields',
                message: `Invalid field - ${firstError}`
            });
        }

        return next();
    };
}


module.exports = {
    validateBodyFields
}
