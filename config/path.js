module.exports = function(env) {
    
    var ret = env === 'dev' ? env : 'min';

    return ret;

}