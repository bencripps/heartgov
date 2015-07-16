/* 
* @Author: ben_cripps
* @Date:   2015-01-10 18:21:13
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-14 20:34:13
*/

module.exports = function(AdminModel, hasher, idGenerator, sessionManager, appMessages, mailer) {
    'use strict';

    var adminCreator = {
        init: function(data, server, request) {
            this.user.checkForUser(data.username)
                .then(this.user.handleAttempt.bind(this, data, server, request), 
                      this.utils.dbError.bind(this, server));
        },
        user: {
            checkForUser: function(username) {
                return AdminModel.findOne({'username': username}).exec();
            },
            handleAttempt: function(data, server, request, result) {

                if (result) {
                    server.send({result: appMessages.accountExists, code: appMessages.failCode});
                }

                else if (data.signupPassword !== process.env.signUpPassword && data.signupPassword !== process.env.adminSignUpPassword) {
                    server.send({result: appMessages.incorrectSignupPassword, code: appMessages.failCode});
                }
                else {
                    adminCreator.user.addToDB(data, server);
                    sessionManager.addUserToSession(request, data);
                }
            },
            addToDB: function(data, server) {
                var info = adminCreator.getAdminModel(data),
                    model = new AdminModel(info);

                model.save(
                    adminCreator.user.alert.bind(this, server, model), 
                    adminCreator.utils.dbError.bind(this, server));
            },
            alert: function(server, data) {
                mailer.sendMail(data.emailAddress, appMessages.newUserMailKey, {username: data.username});
                server.send({result: appMessages.success, code: appMessages.successCode});
            }
        }, 
        getAdminModel: function(data) {
            return {
                userId: idGenerator.getId(),
                username: data.username,
                password: hasher.encrypt(data.password),
                name: {
                    first: data.firstName,
                    last: data.lastName
                },
                zipcode: null,
                emailAddress: data.emailAddress,
                phoneNumber: {
                    string: String(data.phoneNumber),
                    number: data.phoneNumber
                },
                lastLogin: new Date(),
                messagesSent: [],
                superUser: data.signupPassword === process.env.adminSignUpPassword,
                assignedCities: [data.city]
            };

        },
        utils: {
            dbError: function(server, err) {
                console.log('Error!', err);
                server.send({result: appMessages.errorOccurred});
            }

        }
    };

    return adminCreator;

};