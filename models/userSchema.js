/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:06:35
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-09 21:37:22
*/

/*jslint node: true */

module.exports = function(mongoose){
    'use strict';
    return mongoose.model('publicUsers', {
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
};