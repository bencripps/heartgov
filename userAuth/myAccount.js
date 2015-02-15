/* 
* @Author: ben_cripps
* @Date:   2015-01-14 21:19:53
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-15 13:23:03
*/

module.exports = function(AdminModel, hasher, appMessages, shortId, mailSender) {
    'use strict';
    var myAccount = {
        getUser: function(username, server){
            return AdminModel.findOne({username: username}).exec();
        },
        getNewUserObj: function(userData) {
            return {
                password: parseInt(userData.password) ? userData.password : hasher.encrpyt(userData.password),
                name: {
                    first: userData.firstName,
                    last: userData.lastName
                },
                emailAddress: userData.emailAddress,
                phoneNumber: {
                    string: userData.phoneNumber,
                    number: parseInt(userData.phoneNumber)
                }
            };
        },
        updateAccount: function(userData, server){
            AdminModel
                .findOneAndUpdate(
                    {username: userData.username}, 
                    this.getNewUserObj(userData), 
                    this.displayMessage.bind(this, server, appMessages.edit.success), 
                    this.displayMessage.bind(this, server, appMessages.edit.error));
        },
        displayMessage: function(server, msg) {
            server.send({result: msg});
        },
        tryResetPassword: function(username, server) {
            this.getUser(username)
                .then(this.resetPassword.bind(this, server),
                      this.displayMessage.bind(this, server, appMessages.edit.error));
        },
        sendResetEmail: function(server, userData, newPassword) {
            this.displayMessage(server, appMessages.edit.resetSuccess);
            mailSender.sendMail(userData.emailAddress, 'resetSuccess', {password:newPassword});
        },
        resetPassword: function(server, userData,err){
            var newPassword;

            if (userData) {
                newPassword = shortId.getId();
                console.log(newPassword);
                AdminModel.findOneAndUpdate(
                    {username: userData.username},
                    {password: hasher.encrpyt(newPassword)},
                    this.sendResetEmail.bind(this, server, userData, newPassword),
                    this.displayMessage.bind(this, server, appMessages.edit.error));
            }
            else {
                this.displayMessage(server, appMessages.edit.resetUserCouldNotBeFound);
            }

            
        }
    };

    return myAccount;
};