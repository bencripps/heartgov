module.exports = function(env) {
    'use strict';
    var ret = env === 'dev' ? env : 'min';
    return ret;
};