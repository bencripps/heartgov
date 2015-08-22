module.exports = {
    url : process.env.MONGOHQ_URL ||  'mongodb://localhost/heartbreezy' || process.env.PROD_URL_STRING
};