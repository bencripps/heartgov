/* 
* @Author: ben_cripps
* @Date:   2014-12-01 10:10:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-16 20:53:27
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
    favicon = require('serve-favicon'),
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
    app = express(),
    devCredentials = {
        currentUser: 'bencripps1',
        userLevel: true,
        userDetails: {
            _id: '54e561d7a7244f3f34d4f8ac',
            userId: 'XyMMqcPw',
            username: 'bencripps1',
            password: '1216985755',
            zipcode: null,
            emailAddress: 'bencripps1@gmail.com',
            lastLogin: 'Wed Feb 18 2015 22:08:55 GMT-0600 (CST)',
            superUser: true,
            name: {
                first: 'Ben',
                last: 'Cripps'
            },
            phoneNumber: {
                string: '4438788369'
            }
        }
    };

mongoose.connect(database.url);

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');

app.use(favicon('favicon.ico'));

app.use(express.static('app/public'));

app.use(bodyParser.json());

app.use(cookieParser('my secret here'));

app.use(session(sessionOptions));

require('./routes/routes.js')(app, env, fs, url, path(env), database, mongoose, appMessages, twilio, staticPaths, devCredentials);

app.listen(app.get('port'), function() {
    console.log('This app is running in ' + env + ' mode, on port ' + app.get('port'));
});

