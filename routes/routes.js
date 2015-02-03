/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-02 21:08:42
*/

/*jslint node: true */

module.exports = function(app, env, fs, url, path, database, mongoose, appMessages, twilio, staticPaths) {
    'use strict';
 
    var format = require('../config/format')(path),
        shortid = require('../config/generateId'),
        indexScripts = ['/scripts/views/loginView.js'],
        adminCreateScripts = ['/scripts/views/createUserView.js'],
        preloader = require('../config/preloader')(staticPaths),
        allImages,
        mainScripts = ['/scripts/views/mainView.js'],
        myAccountScripts = ['/scripts/views/myAccountView.js'],
        sessionManager = require('../config/sessionManager'),
        session = {},
        schemas = {
            admin: require('../models/adminSchema'),
            text: require('../models/textSchema'),
            user: require('../models/userSchema') 
        },
        nodemailer = require('nodemailer'),
        mailSender = require('../mailer/mailer')(nodemailer, schemas.admin, appMessages.mailMessages),
        twilioWrapper = require('../sms/twilioWrapper')(twilio, appMessages.twilio, schemas),
        hasher = require('../userAuth/hasher'),
        myAccount = require('../userAuth/myAccount')(schemas.admin, hasher, appMessages.myAccountMessages),
        loginService = require('../userAuth/login')(schemas.admin, hasher, sessionManager, appMessages.loginMessages),
        adminCreator = require('../userAuth/adminCreator')(schemas.admin, hasher, shortid, sessionManager, appMessages.accountCreationMessages, mailSender),
        textReceiver = require('../sms/textReceiver')(mongoose, shortid, schemas, appMessages, mailSender),
        textDistributor = require('../sms/textDistributor')(mongoose, schemas.text, appMessages.textDistribution),
        getTemplateConfig = require('../config/template')(appMessages.templateConfig, path);

    app.get('/', function(req, res) {

        // sessionManager.set(session, req.session);

        allImages = allImages || preloader.getImages();

        session = session || req.session;

    	res.render('index', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            allImages: allImages,
            activeMarker: '/'
        }));

    });

    app.get('/about', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('about', getTemplateConfig({   
            local: path,
            teamMembers: appMessages.aboutPage.teamMembers,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            activeMarker: '/about'
        }));

    });

     app.get('/press', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('press', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            stories: appMessages.pressPage.stories,
            activeMarker: '/press'
        }));

    });

    app.get('/contact', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('contact', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            activeMarker: '/contact'
        }));

    });

    app.get('/faq', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('faq', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            faq: appMessages.faqPage.questions,
            activeMarker: '/faq'
        }));

    });

    app.get('/signin', function(req, res) {

        // sessionManager.set(session, req.session);

        session = session || req.session;

        res.render('signin', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            loggedIn: session.loggedIn,
            activeMarker: '/signin'
        }));

    });

    app.get('/signup', function(req, res) {

        session = session || req.session;

        res.render('createUser', getTemplateConfig({   
            local: path,
            scripts: format.call(adminCreateScripts),
            loggedIn: session.loggedIn,
            activeMarker: '/signin'
        }));

    });

    app.get('/main', function(req, res) {

        session = session || req.session;

        var options = getTemplateConfig({   
                local: path,
                scripts: format.call(mainScripts),
                loggedIn: session.loggedIn,
                headers: appMessages.textDistribution.displayFields,
                activeMarker: '/main'
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
                    scripts: format.call(myAccountScripts),
                    loggedIn: session.loggedIn,
                    userDetails: user,
                    activeMarker: '/myaccount'
                });
                res.render(localPath, options);             
            });
        }

        else {
            localPath = 'unauthorized';
            options = getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                loggedIn: session.loggedIn,
                activeMarker: '/'
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

    app.post('/edit/account', function(req,res){
        myAccount.updateAccount(req.body, res);
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

    app.post('/send/outgoingText', function(req, res) {
        twilioWrapper.sendOutGoingText(req.body.content, req.body.to, req.body._id, req.body.from, res);
    });

   
};