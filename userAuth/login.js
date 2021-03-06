/* 
* @Author: ben_cripps
* @Date:   2015-01-10 11:27:15
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-17 10:58:47
*/

module.exports = function(AdminSchema, hasher, sessionManager, myAccount, appMessages) {
    'use strict';
    
    var loginService = {
        validate: function(info, server, session) {
            this.findUser(info)
                .then(
                    this.hasCorrectPassword.bind(this, server, info, session), 
                    this.utils.dbError.bind(this, server));
        },
        hasCorrectPassword: function(server, info, session, result) {
            if (result && this.checkPassword(result.password, info.password)) {
                myAccount.updateLastLogin(info);

                server.send({result: appMessages.success, code: appMessages.successCode, key: !!sessionManager.addUserToSession(session, result), city: result.assignedCities[0]});
            }
            else {
                server.send({result: appMessages.incorrect, code: appMessages.failCode});
            }
        },
        checkPassword: function(correctPassword, attemptedPassword) {
            return correctPassword === hasher.encrypt(attemptedPassword);
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
