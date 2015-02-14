/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:07:34
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:44:31
*/

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
        associatedUsers: [],
        dateCreated: {type: Date, default: new Date()},
        creator: {
            username: String,
            id: String,
            emailAddress: String
        }
    });

};