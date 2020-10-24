'use strict';
const {createLogger, transports, format} = require('winston');
let logger;

const myFormat = format.printf(({level, message, timestamp}) => {
    let toLog = message;
    if (message && message.constructor === Object) {
        toLog = JSON.stringify(message, null, 4);
    }
    return `${timestamp} ${level}: ${toLog}`;
});

if (process.env.NODE_ENV === 'production') {
    logger = createLogger({
        transports: [
            new (transports.Console)({
                timestamp:        true,
                colorize:         false,
                level:            'info',
                handleExceptions: true,
                format: format.combine(
                    format.timestamp(),
                    myFormat
                )
            }),
            new (transports.File)({
                name:        'infoFile',
                filename:    process.env.LOGGER_INFO_PATH,
                level:       process.env.LOGGER_INFO_LEVEL,
                prettyPrint: false,
                json:        true,
                colorize:    false,
                maxsize:     process.env.LOGGER_FILE_MAX_SIZE,
                maxFiles:    process.env.LOGGER_MAX_FILES
            }),
            new (transports.File)({
                name:        'errorFile',
                filename:    process.env.LOGGER_ERROR_PATH,
                level:       process.env.LOGGER_ERROR_LEVEL,
                prettyPrint: false,
                json:        true,
                colorize:    false,
                maxsize:     process.env.LOGGER_FILE_MAX_SIZE,
                maxFiles:    process.env.LOGGER_MAX_FILES
            })
        ],
        exitOnError: true
    });
} else {
    logger = createLogger({
        transports: [
            new (transports.Console)({
                timestamp: true,
                colorize:  true,
                level:     'debug',
                format: format.combine(
                    format.timestamp(),
                    myFormat
                )
            })
        ]
    });
}

module.exports = logger;
