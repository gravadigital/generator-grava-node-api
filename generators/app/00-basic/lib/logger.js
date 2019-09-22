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

logger._info = logger.info;
logger._debug = logger.debug;
logger._error = logger.error;

logger.info = function(data1, data2) {
    if (data2) {
        data1 += ` ${JSON.stringify(data2, null, 2)}`;
    }
    return logger._info(data1);
};

logger.debug = function(data1, data2) {
    if (data2) {
        data1 += ` ${JSON.stringify(data2, null, 2)}`;
    }
    return logger._debug(data1);
};

logger.error = function(data1, data2) {
    if (data2) {
        data1 += ` ${JSON.stringify(data2, null, 2)}`;
    }
    return logger._error(data1);
};

module.exports = logger;
