'use strict';
const logger = require('@lib/logger');
const {User} = require('@lib/models');

function createDefaultAdmin() {
    let email = process.env.DEFAULTADMIN_EMAIL;
    const fullName = process.env.DEFAULTADMIN_NAME;
    const pass = process.env.DEFAULTADMIN_PASSWORD;
    if (!email || email.length === 0 || !pass || pass.length === 0) {
        return Promise.resolve();
    }
    email = email.toLowerCase();
    return User.findOne({email})
        .then((adminUser) => {
            if (adminUser) {
                return null;
            }
            return User.create({
                email,
                fullName,
                password: pass,
                role: 'admin'
            });
        })
        .catch((error) => {
            logger.error(`createDefaultAdmin error: ${error.message}`);
        });
}

module.exports = createDefaultAdmin;
