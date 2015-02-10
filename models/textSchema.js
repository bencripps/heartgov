/* 
* @Author: ben_cripps
* @Date:   2015-01-08 19:43:27
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-09 21:39:03
*/

/*jslint node: true */

module.exports = function(mongoose){
    'use strict';
    return mongoose.model('recievedSMS', {
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
            lastResponder: String,
            trackingNumber: String,
            searchable: [],
            visible: {type: Boolean, default: true}
        }
    });
};