/* 
* @Author: ben_cripps
* @Date:   2015-01-14 21:19:53
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-14 22:01:10
*/


/*jslint node: true */

module.exports = function(AdminModel) {
    'use strict';
    var myAccount = {
        getUser: function(email, server){
            return AdminModel.findOne({emailAddress: email}).exec();
        }
    };

    return myAccount;
};