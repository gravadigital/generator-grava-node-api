'use strict';
const publicPaths = {
    get: [],
    put: [],
    post: ['api/auth'],
    delete: []
};

function regex(method) {
    const prefix = '^\/';
    const pathRegexStr = prefix + publicPaths[method.toLowerCase()].map((path) => {
        return `(?!${path})`;
    }).join('') + '.*';
    return new RegExp(pathRegexStr, 'i');
}

module.exports = {
    regex
};
