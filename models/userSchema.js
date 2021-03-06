/* 
* @Author: ben_cripps
* @Date:   2015-01-08 20:06:35
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:46:24
*/

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