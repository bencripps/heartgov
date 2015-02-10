/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:07:34
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-09 21:37:41
*/

/*jslint node: true */

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