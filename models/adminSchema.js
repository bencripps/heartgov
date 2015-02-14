/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:07:34
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:46:19
*/

module.exports = function(mongoose){
    'use strict';
    return mongoose.model('adminUsers', {
        userId: String,
        username: String,
        password: String,
        name: {
            first: String,
            last: String,
        },
        zipcode: Number,
        emailAddress: String,
        phoneNumber: {
            string: String,
            number: Number
        },
        lastLogin: Date,
        messagesSent: [],
        superUser: Boolean
    });
};