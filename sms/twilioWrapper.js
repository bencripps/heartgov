/* 
* @Author: ben_cripps
* @Date:   2015-01-09 21:59:31
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-23 23:06:03
*/

/*jslint node: true */

module.exports = function(client, appMessages) {
    'use strict';
    
    var twilioWrapper = {
        twilioNumber: process.env.twilioNumber,
        sendOutGoingText: function(response, receiver, server) {
            //need to work on binding an outgoing message to a specific DB id
            // this.saveOutGoingText
            // this is disabled for right now, because we dont want to send a ton of texts -- this functionality works
            // this.processOutGoingText(response, receiver).then(this.twilioSuccess.bind(this, server), this.twilioError.bind(this,server));
        },
        processOutGoingText: function(response, receiver) {

            var sms = client.sms.messages.create({
                to: receiver,
                from: this.twilioNumber,
                body: response
            });

            return sms;
        },
        saveOutGoingText: function() {

        },
        twilioSuccess: function(server, data) {
            server.send({result: appMessages.messageSent});
            console.log('Success!', data);
        },
        twilioError: function(server, data) {
            server.send({result: appMessages.messageNotSent});
            console.log('Error!', data);
        }
    };

    return twilioWrapper;
};