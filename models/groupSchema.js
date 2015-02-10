/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:07:34
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-09 21:38:44
*/

/*jslint node: true */

module.exports = function(mongoose){
    'use strict';
    return mongoose.model('groups', {
        groupId: String,
        groupName: String,
        organization: {
            id: String,
            name: String
        },
        associatedPhoneNumbers: [],
        dateCreated: {type: Date, default: new Date()},
        creator: {
            username: String,
            id: String,
            emailAddress: String
        }
    });

};