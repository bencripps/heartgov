/* 
* @Author: ben_cripps
* @Date:   2015-01-14 21:19:53
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:43:59
*/

module.exports = function(AdminModel, hasher, appMessages) {
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
                .findOneAndUpdate({username: userData.username}, 
                    this.getNewUserObj(userData), this.accountHasBeenUpdated.bind(this,server), 
                    this.errorOccured.bind(this,server));
        },
        errorOccured: function(server) {
            server.send({result: appMessages.edit.error});
        },
        accountHasBeenUpdated: function(server){
            server.send({result: appMessages.edit.success});
        }
    };

    return myAccount;
};