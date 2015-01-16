/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:07:34
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-11 10:38:09
*/

/*jslint node: true */

'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('adminUsers', {
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