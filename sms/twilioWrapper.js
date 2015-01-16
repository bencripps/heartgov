/* 
* @Author: ben_cripps
* @Date:   2015-01-09 21:59:31
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-12 11:08:39
*/

/*jslint node: true */

module.exports = function(client) {
    'use strict';
    
    var twilioWrapper = {
        twilioNumber: process.env.twilioNumber,
        sendOutGoingText: function(response, receiver) {
            console.log(response);
            // this is disabled for right now, because we dont want to send a ton of texts -- this functionality works
            // this.processOutGoingText(response, receiver).then(this.twilioSuccess, this.twilioError);
        },
        processOutGoingText: function(response, receiver) {

            var sms = client.sms.messages.create({
                to: receiver,
                from: this.twilioNumber,
                body: response
            });

            return sms;
        },
        twilioSuccess: function(data) {
            console.log('Success!', data);
        },
        twilioError: function(data) {
            console.log('Error!', data);
        }
    };

    return twilioWrapper;
};