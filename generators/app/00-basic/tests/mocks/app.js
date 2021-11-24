'use strict';

const path = require('path');
const envPath = path.join(__dirname, '/../../.env.test');
require('dotenv').config({path: envPath});
require('module-alias/register');
const logger = require('@logger');
const mongoose = require('mongoose');
const app = require('../../app');

function connectMongoose() {
    return new Promise((resolve, reject) => {
        mongoose.Promise = Promise;
        mongoose.connect(
            `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`,
            {useNewUrlParser: true}
        )
            .then(() => {
                logger.info('Mongoose connection: OK');
                return resolve();
            })
            .catch((error) => {
                logger.error(`Mongoose connection: ${error.message}`);
                return reject();
            });
    });
}

function start() {
    return connectMongoose()
        .then(() => {
            return app.initialize();
        });
}

function finish() {
    return mongoose.connection.close();
}

module.exports = {
    finish,
    start
};
