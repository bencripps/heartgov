/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-05-08 18:25:22
*/

module.exports = function(app, env, fs, url, path, database, mongoose, appMessages, twilio, staticPaths, devCredentials) {
    'use strict';

    var format = require('../config/format')(path),
        jade = require('jade'),
        shortid = require('../config/generateId'),
        indexScripts = ['/scripts/views/loginView.js'],
        adminCreateScripts = ['/scripts/views/createUserView.js'],
        groupsScripts = ['/scripts/views/groupsView.js'],
        forgotPasswordScripts = ['/scripts/views/forgotPasswordView.js'],
        preloader = require('../config/preloader')(staticPaths),
        allImages,
        mainScripts = ['/scripts/views/mainView.js'],
        myAccountScripts = ['/scripts/views/myAccountView.js'],
        loggedInUsers = [],
        sessionManager = require('../userAuth/sessionManager')(shortid, loggedInUsers),
        schemas = {
            admin: require('../models/adminSchema')(mongoose),
            text: require('../models/textSchema')(mongoose),
            user: require('../models/userSchema')(mongoose),
            groups: require('../models/groupSchema')(mongoose),
        },
        nodemailer = require('nodemailer'),
        mailSender = require('../mailer/mailer')(jade, nodemailer, schemas.admin, appMessages.mailMessages),
        twilioWrapper = require('../sms/twilioWrapper')(twilio, appMessages.twilio, schemas),
        hasher = require('../userAuth/hasher'),
        myAccount = require('../userAuth/myAccount')(schemas.admin, hasher, appMessages.myAccountMessages, shortid, mailSender),
        groupManager = require('../groups/groupManager')(mongoose, myAccount, schemas.groups, shortid, appMessages.groupMessages),
        loginService = require('../userAuth/login')(schemas.admin, hasher, sessionManager, myAccount, appMessages.loginMessages),
        adminCreator = require('../userAuth/adminCreator')(schemas.admin, hasher, shortid, sessionManager, appMessages.accountCreationMessages, mailSender),
        textReceiver = require('../sms/textReceiver')(mongoose, shortid, schemas, appMessages, mailSender),
        textDistributor = require('../sms/textDistributor')(mongoose, schemas.text, appMessages.textDistribution),
        getTemplateConfig = require('../config/template')(appMessages.templateConfig, path),
        dev = env === 'dev';

    app.get('/', function(req, res) {

        allImages = allImages || preloader.getImages();

        textDistributor.execute().then(function(results){

        	res.render('index', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: sessionManager.getLoggedInUser(req.sessionID),
                allImages: allImages,
                activeMarker: '/',
                results: results.slice(0,4)
            }));

        });

    });

    app.get('/about', function(req, res) {

        res.render('about', getTemplateConfig({   
            local: path,
            team: appMessages.aboutPage,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: '/about'
        }));

    });

     app.get('/press', function(req, res) {

        res.render('press', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            stories: appMessages.pressPage.stories,
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: '/press'
        }));

    });

    app.get('/contact', function(req, res) {

        res.render('contact', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: '/contact'
        }));

    });

     app.get('/groups', function(req, res) {

        if (sessionManager.isLoggedIn(req.sessionID) || dev) {

            myAccount.getUser(sessionManager.getLoggedInUser(req.sessionID)).then(function(user){
                res.render('groups', getTemplateConfig({   
                    local: path,
                    scripts: format.call(groupsScripts),
                    currentUser: dev ? devCredentials.currentUser : sessionManager.getLoggedInUser(req.sessionID),
                    userLevel: dev ? devCredentials.userLevel : user.superUser,
                    activeMarker: '/groups',
                    userDetails: dev ? devCredentials.userDetails : user
                }));             
            });
        }

        else {
            res.render('unauthorized', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: sessionManager.getLoggedInUser(req.sessionID),
                activeMarker: '/'
            }));
        }

    });

    app.get('/faq', function(req, res) {

        res.render('faq', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            faq: appMessages.faqPage.questions,
            activeMarker: '/faq'
        }));

    });

    app.get('/signin', function(req, res) {

        res.render('signin', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: '/signin'
        }));

    });

    app.get('/signup', function(req, res) {

        res.render('createUser', getTemplateConfig({   
            local: path,
            scripts: format.call(adminCreateScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: ''
        }));

    });

    app.get('/forgotpassword', function(req, res){
        res.render('forgotpassword', getTemplateConfig({   
            local: path,
            scripts: format.call(forgotPasswordScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: ''
        }));
    });

    app.get('/database', function(req, res) {

        if (sessionManager.isLoggedIn(req.sessionID) || dev) {

            myAccount.getUser(sessionManager.getLoggedInUser(req.sessionID)).then(function(user){
                res.render('database', getTemplateConfig({   
                    local: path,
                    scripts: format.call(mainScripts),
                    currentUser: dev ? devCredentials.currentUser : sessionManager.getLoggedInUser(req.sessionID),
                    headers: appMessages.textDistribution.displayFields,
                    userLevel: dev ? devCredentials.userLevel : user.superUser,
                    activeMarker: '/database',
                    userDetails: dev ? devCredentials.userDetails : user
                }));             
            });
        }

        else {
            res.render('unauthorized', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: sessionManager.getLoggedInUser(req.sessionID),
                activeMarker: '/'
            }));
        }

    });

     app.get('/myaccount', function(req, res) {

        var options;

        if (sessionManager.isLoggedIn(req.sessionID) || dev) {

            myAccount.getUser(sessionManager.getLoggedInUser(req.sessionID)).then(function(user){
                options = getTemplateConfig({   
                    local: path,
                    scripts: format.call(myAccountScripts),
                    currentUser: dev ? devCredentials.currentUser : sessionManager.getLoggedInUser(req.sessionID),
                    userDetails: dev ? devCredentials.userDetails : user,
                    activeMarker: '/myaccount'
                });

                res.render('myaccount', options);             
            });
        }

        else {
            options = getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: sessionManager.getLoggedInUser(req.sessionID),
                activeMarker: '/'
            });
            res.render('unauthorized', options);
        }

    });

    app.post('/recievedPublicText', function(req, res) {
        
        textReceiver.handleResponse(req.body, twilioWrapper);
        res.send({result: appMessages.twilio.dataReceived});

    });

    app.get('*', function(req, res){
        res.render('pageNotFound', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: ''
        }));
    });

    app.post('/add/phonenumber/group', function(req, res){
        groupManager.modifyGroupPhoneNumberList('add', req.body, res);
    });

    app.post('/reset/password', function(req, res){
        myAccount.tryResetPassword(req.body.username, res);
    });

    app.post('/edit/account', function(req, res){
        myAccount.updateAccount(req.body, res);
    });

    app.post('/find/texts', function(req, res) {
        textDistributor.findTextsBy(req.body, res);
    });

    app.post('/edit/group', function(req, res){
        groupManager.updateGroup(req.body, res);
    });

     app.post('/find/availableGroups', function(req, res) {
        groupManager.findAvailableGroups(req.body.username, res);
    });

    app.post('/delete/text', function(req, res) {
        textDistributor.utils.deleteText(req.body.id, res);
    });

    app.post('/delete/group', function(req, res) {
        groupManager.deleteGroup(req.body.id, res);
    });

    app.post('/create/group', function(req, res) {
        groupManager.createGroup(req.body, res);
    });

    app.post('/login', function(req, res) {
        loginService.validate(req.body, res, req);
    });

    app.post('/logout', function(req, res) {
        sessionManager.logout(req.sessionID);
        res.send({result: appMessages.loginMessages.loggedOut, code: 1});
    });

    app.post('/createUser', function(req, res) {
        adminCreator.init(req.body, res, req);
    });

    app.post('/send/outgoingText', function(req, res) {
        twilioWrapper.sendOutGoingText(req.body.content, req.body.to, req.body._id, req.body.from, res);
    });

    app.post('/upload/import', function(req, res){
        groupManager.importNumbers(req.body, res);
    });

};