/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-15 09:38:07
*/

/*jslint node: true */

module.exports = function(app, env, fs, url, path, database, mongoose, appMessages, twilio) {
    'use strict';
 
    var format = require('../config/format')(path),
        shortid = require('../config/generateId'),
        indexScripts = ['/scripts/views/loginView.js'],
        adminCreateScripts = ['/scripts/views/createUserView.js'],
        mainScripts = ['/scripts/views/mainView.js'],
        sessionManager = require('../config/sessionManager'),
        session = {},
        schemas = {
            admin: require('../models/adminSchema'),
            text: require('../models/textSchema'),
            user: require('../models/userSchema') 
        },
        nodemailer = require('nodemailer'),
        mailSender = require('../mailer/mailer')(nodemailer, schemas.admin, appMessages.mailMessages),
        twilioWrapper = require('../sms/twilioWrapper')(twilio),
        myAccount = require('../userAuth/myAccount')(schemas.admin),
        hasher = require('../userAuth/hasher'),
        loginService = require('../userAuth/login')(schemas.admin, hasher, sessionManager, appMessages.loginMessages),
        adminCreator = require('../userAuth/adminCreator')(schemas.admin, hasher, shortid, sessionManager, appMessages.accountCreationMessages, mailSender),
        textReceiver = require('../sms/textReceiver')(mongoose, shortid, schemas, appMessages),
        textDistributor = require('../sms/textDistributor')(mongoose, schemas.text, appMessages.textDistribution),
        getTemplateConfig = require('../config/template')(appMessages.templateConfig, path);

    app.get('/', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

    	res.render('index', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn 
        }));

    });

    app.get('/about', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('about', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn 
        }));

    });

     app.get('/news', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('news', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn 
        }));

    });

    app.get('/contact', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('contact', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn 
        }));

    });

    app.get('/faq', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('faq', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn 
        }));

    });

    app.get('/signup', function(req, res) {

        session = session || req.session;

        res.render('createUser', getTemplateConfig({   
            local: path,
            scripts: format.call(adminCreateScripts),
            loggedIn: session.loggedIn 
        }));

    });

    app.get('/main', function(req, res) {

        session = session || req.session;

        var options = getTemplateConfig({   
                local: path,
                scripts: format.call(mainScripts),
                loggedIn: session.loggedIn,
                headers: appMessages.textDistribution.displayFields
            }),
            localPath = session.loggedIn ? 'main' : 'unauthorized';

        res.render(localPath, options);

    });

     app.get('/myaccount', function(req, res) {

        var options,
            localPath;

        session = session || req.session;

        if (session.loggedIn) {

            myAccount.getUser(session.loggedIn).then(function(user, err){
                localPath = 'myaccount';
                options = getTemplateConfig({   
                    local: path,
                    scripts: format.call(indexScripts),
                    loggedIn: session.loggedIn,
                    userDetails: user
                });
                console.log(err);
                res.render(localPath, options);             
            });
        }

        else {
            localPath = 'unauthorized';
            options = getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                loggedIn: session.loggedIn
            });
            res.render(localPath, options);
        }

    });

    app.get('/recievedPublicText', function(req, res) {

        // var response = textReceiver.handleResponse(req.body, twilioWrapper);
        var response = textReceiver.handleResponse({
            from: '4438788369',
            to: '1234567890',
            body: 'im a new texter and Im messaging about (2)'
        }, twilioWrapper);

        res.send({result: appMessages.twilio.dataReceived});

    });

    app.post('/find/texts', function(req, res) {
        textDistributor.findTextsBy(req.body, res);
    });

    app.post('/login', function(req, res) {
        loginService.validate(req.body, res, session);
    });

    app.post('/logout', function(req, res) {
        session = req.session;
        res.send({result: appMessages.loginMessages.loggedOut, code: 1});
    });

    app.post('/createUser', function(req, res) {
        adminCreator.init(req.body, res, session);
    });

   
};