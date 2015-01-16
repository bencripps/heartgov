/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:06:35
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-08 21:33:36
*/

/*jslint node: true */

'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('publicUsers', {
    userId: String,
    name: String,
    zipcode: Number,
    phoneNumber: {
        string: String,
        number: Number
    },
    lastMessageRecievedOn: {type: Date, default: Date.now},
    allMessages:[],
    associatedTrackingNumbers: []
});