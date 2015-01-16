/* 
* @Author: ben_cripps
* @Date:   2015-01-08 19:43:27
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-10 13:33:35
*/

/*jslint node: true */

'use strict';

var mongoose = require('mongoose');

module.exports = mongoose.model('recievedSMS', {
    userInformation: {
        userId: String,
        name: String,
        zipcode: Number,
        phoneNumber: {
            string: String,
            number: Number
        },
        messageRecievedOn: {type: Date, default: Date.now}
    },
    textInformation: {
        category: {
            id: Number,
            name: String,
        },
        body: String,
        status: String,
        zipcode: Number,
        date: {type: Date, default: Date.now},
        responders: [],
        lastResponder: [],
        trackingNumber: String,
        searchable: []
    }
});