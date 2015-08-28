module.exports = {
    // url : process.env.MONGOHQ_URL || 'mongodb://localhost/heartbreezy'
    url : process.env.MONGOHQ_URL || process.env.PROD_URL_STRING || 'mongodb://localhost/heartbreezy'
};