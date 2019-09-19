'use strict';
require('dotenv').config();
const app = require('../app');
const logger = require('../lib/logger');

return app.connectMongoose()
    .then(() => {
        const application = app.initialize();
        application.listen(process.env.SERVER_PORT);
        logger.info(`Your server is listening on port ${process.env.SERVER_PORT}`);
        //**//INIT-POST-SCRIPTS//**//
    })
    .catch((error) => {
        logger.error('APP STOPPED');
        logger.error(error);
        return process.exit(1);
    });
