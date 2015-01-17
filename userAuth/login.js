/* 
* @Author: ben_cripps
* @Date:   2015-01-10 11:27:15
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-17 13:21:52
*/

/*jslint node: true */

module.exports = function(AdminSchema, hasher, sessionManager, appMessages) {
    'use strict';
    
    var loginService = {
        validate: function(info, server, session) {
            this.findUser(info).then(this.hasCorrectPassword.bind(this, server, info, session), this.utils.dbError.bind(this, server));
        },
        hasCorrectPassword: function(server, info, session, result) {
            if (result && this.checkPassword(result.password, info.password)) {
                sessionManager.login(session, info.username);
                server.send({result: appMessages.success, code: appMessages.successCode});
            }
            else {
                server.send({result: appMessages.incorrect, code: appMessages.failCode});
            }
        },
        checkPassword: function(correctPassword, attemptedPassword) {
            return correctPassword === hasher.encrpyt(attemptedPassword);
        },
        findUser: function(info) {
            return AdminSchema.findOne({'username': info.username}).exec();
        },
        utils: {
            dbError: function(server, err) {
                console.log('Error occurred!', err);
                server.send({result: appMessages.errorOccurred});
            },
            setSession: function(session, username) {
                session.username = username;
            }
        }

    };

    return loginService;
};
