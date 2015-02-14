/* 
* @Author: ben_cripps
* @Date:   2014-12-01 10:10:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:46:04
*/

'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    env = process.argv.length === 3 && process.argv[2] === 'dev' ? process.argv[2] : 'prod',
    fs = require('fs'),
    url = require('url'),
    path = require('./config/path'),
    mongoose = require('mongoose'),
    database = require('./config/database'),
    appMessages = require('./config/appMessages'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionOptions = {
        secret: process.env.sessionKey,
        path: '/', 
        httpOnly: true, 
        secure: true, 
        maxAge: 6000
    },
    staticPaths = {
        img: 'app/public/min/images'
    },
    accountSID = process.env.accountSID,
    authToken = process.env.authToken,
    twilio = require('twilio')(accountSID, authToken),
    app = express();

mongoose.connect(database.url);

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');

app.use(express.static('app/public'));

app.use(bodyParser.json());

app.use(cookieParser('my secret here'));

app.use(session(sessionOptions));

require('./routes/routes.js')(app, env, fs, url, path(env), database, mongoose, appMessages, twilio, staticPaths);

app.listen(app.get('port'), function() {
    console.log('This app is running in ' + env + ' mode, on port ' + app.get('port'));
});

