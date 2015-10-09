
/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-10-09 16:06:57
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
        sessionManager = require('../userAuth/sessionManager')(shortid, loggedInUsers, myAccount),
        groupManager = require('../groups/groupManager')(mongoose, myAccount, schemas.groups, shortid, appMessages.groupMessages),
        loginService = require('../userAuth/login')(schemas.admin, hasher, sessionManager, myAccount, appMessages.loginMessages),
        adminCreator = require('../userAuth/adminCreator')(schemas.admin, hasher, shortid, sessionManager, appMessages.accountCreationMessages, mailSender),
        austinHandler = require('../sms/austin/handler')(mongoose, schemas.text, schemas.admin, shortid, appMessages),
        redhookHandler = require('../sms/redhook/handler')(mongoose, schemas.text, schemas.admin, shortid, appMessages),
        councilmaticHandler = require('../sms/councilmatic/handler')(mongoose, schemas.text, schemas.admin, shortid, appMessages),
        textReceiver = require('../sms/textReceiver')(mongoose, shortid, schemas, appMessages, mailSender, austinHandler, redhookHandler, councilmaticHandler),
        textDistributor = require('../sms/textDistributor')(mongoose, schemas.text, appMessages.textDistribution, appMessages.cities),
        getTemplateConfig = require('../config/template')(appMessages, path),
        exporter = require('../export/exporter')(schemas.text, appMessages),
        dev = env === 'dev';

    var sampleTwilResponse = {
        AccountSid: 'AC5ef872f6da5a21de157d80997a64bd33',
        ApiVersion: '2008-08-01',
        Body: 'Hey Asher, why arent you returning my car?',
        DateCreated: 'Mon, 16 Aug 2010 03:45:01 +0000',
        DateSent: 'Mon, 16 Aug 2010 03:45:03 +0000',
        DateUpdated: 'Mon, 16 Aug 2010 03:45:03 +0000',
        Direction: 'outbound-api',
        From: '4438788369',
        Price: '-0.02000',
        MessageSid: 'SM800f449d0399ed014aae2bcc0cc2f2ec',
        Status: 'sent',
        To: '+16468464332',
        Uri: '/2010-04-01/Accounts/AC5ef872f6da5a21de157d80997a64bd33/SMS/Messages/SM800f449d0399ed014aae2bcc0cc2f2ec.json',
        FromCity: 'Baltimore',
        FromState: 'MD',
        FromZip: '21228',
        FromCountry: 'USA',
        ToCity: 'Austin',
        ToState: 'TX',
        ToZip: '78751',
        ToCountry: 'USA'
    };

    app.get('/', function(req, res) {

        allImages = allImages || preloader.getImages();

        // textDistributor.execute({startIndex: 0}).then(function(results){

            sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
                
            	res.render('index', getTemplateConfig({   
                    local: path,
                    scripts: format.call(indexScripts),
                    currentUser: resp.user,
                    allImages: allImages,
                    activeMarker: '/',
                    // results: results.slice(0,4),
                    location: resp.location
                }));
            });

        // });

    });

    app.get('/about', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('about', getTemplateConfig({   
                local: path,
                team: appMessages.aboutPage,
                scripts: format.call(indexScripts),
                currentUser: resp.user,
                activeMarker: '/about',
                location: resp.location
            }));
        });

    });

     app.get('/press', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('press', getTemplateConfig({   
                local: path,
                stories: appMessages.pressPage.stories,
                scripts: format.call(indexScripts),
                currentUser: resp.user,
                activeMarker: '/press',
                location: resp.location
            }));
        });

    });

    app.get('/contact', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('contact', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: resp.user,
                activeMarker: '/contact',
                location: resp.location
            }));
        });


    });

     app.get('/:city/groups', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            
            if (resp.isSuccessful) {
            
                res.render('groups', getTemplateConfig({  
                    escapedDir: '../', 
                    local: path,
                    location: req.params.city,
                    scripts: format.call(groupsScripts),
                    headers: appMessages.textDistribution.displayFields,
                    currentUser: resp.user,
                    userLevel: resp.user.superUser,
                    activeMarker: '/groups',
                    userDetails: resp.user
                }));             
              
            }

            else {

                res.render('unauthorized', getTemplateConfig({   
                    local: path,
                    escapedDir: '../', 
                    scripts: format.call(indexScripts),
                    currentUser: false,
                    activeMarker: '/'
                }));
            }
        });


    });

    app.get('/faq', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('faq', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                faq: appMessages.faqPage.questions,
                currentUser: resp.user,
                activeMarker: '/faq',
                location: resp.location
            }));
        });

    });

    app.get('/signin', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('signin', getTemplateConfig({   
                local: path,
                scripts: format.call(indexScripts),
                currentUser: resp.user,
                activeMarker: '/signin',
                location: resp.location
            }));
        });

    });

    app.get('/signup', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('createUser', getTemplateConfig({   
                local: path,
                scripts: format.call(adminCreateScripts),
                currentUser: resp.user,
                activeMarker: '',
                cities: appMessages.cities,
                location: resp.location
            }));
        });

    });

    app.get('/forgotpassword', function(req, res){
        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            res.render('forgotpassword', getTemplateConfig({   
                local: path,
                scripts: format.call(forgotPasswordScripts),
                currentUser: resp.user,
                activeMarker: '',
                location: resp.location
            }));
        });
    });

    app.get('/:city/database', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            
            if (resp.isSuccessful) {
            
                res.render('database', getTemplateConfig({  
                    escapedDir: '../', 
                    local: path,
                    location: req.params.city,
                    scripts: format.call(mainScripts),
                    headers: appMessages.textDistribution.displayFields,
                    currentUser: resp.user,
                    userLevel: resp.user.superUser,
                    activeMarker: '/database',
                    userDetails: resp.user
                }));             
              
            }

            else {

                res.render('unauthorized', getTemplateConfig({   
                    local: path,
                    escapedDir: '../', 
                    scripts: format.call(indexScripts),
                    currentUser: false,
                    activeMarker: '/'
                }));
            }
        });

    });

    app.get('/:city/myaccount', function(req, res) {

        sessionManager.isLoggedIn(req.sessionID, dev, devCredentials, req.params.city).then(function(resp) {
            
            if (resp.isSuccessful) {

                res.render('myaccount', getTemplateConfig({  
                    escapedDir: '../', 
                    local: path,
                    location: req.params.city,
                    scripts: format.call(myAccountScripts),
                    currentUser: resp.user,
                    userLevel: resp.user.superUser,
                    activeMarker: '/myaccount',
                    userDetails: resp.user
                }));             
              
            }

            else {

                res.render('unauthorized', getTemplateConfig({   
                    local: path,
                    escapedDir: '../', 
                    scripts: format.call(indexScripts),
                    currentUser: false,
                    activeMarker: '/',
                    location: ''
                }));
            }
        });


    });

    //for testing

    app.get('/testEmail', function(req, res) {
        textReceiver.doTestEmail(sampleTwilResponse, twilioWrapper);
    });

    app.get('/testResponse', function(req, res) {
        textReceiver.handleResponse(sampleTwilResponse, twilioWrapper);
    });

    app.get('*', function(req, res){
        res.render('pageNotFound', getTemplateConfig({   
            local: path,
            scripts: format.call(indexScripts),
            currentUser: sessionManager.getLoggedInUser(req.sessionID),
            activeMarker: '',
            location: ''
        }));
    });

    app.post('/recievedPublicText', function(req, res) {
        //to do: determine which number is coming in, and do their work flow
        textReceiver.handleResponse(req.body, twilioWrapper);
        res.send({result: appMessages.twilio.dataReceived});

    });

    app.post('/:city/add/phonenumber/group', function(req, res){
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
        twilioWrapper.sendOutGoingText(req.body.content, req.body.to, req.body._id, req.body.from, res, req.body.city);
    });

    app.post('/send/outgoingGroupText', function(req, res) {
        twilioWrapper.sendGroupOutGoingText(groupManager, req.body, res, req.body.city);
    });

    app.post('/upload/import', function(req, res){
        groupManager.importNumbers(req.body, res);
    });

    app.post('/export/texts', function(req, res) {
        exporter.export(req.body, res);
    });

};