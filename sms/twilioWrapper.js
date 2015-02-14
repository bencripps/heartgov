/* 
* @Author: ben_cripps
* @Date:   2015-01-09 21:59:31
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:44:21
*/

module.exports = function(client, appMessages, schemas) {
    'use strict';
    
    var twilioWrapper = {
        twilioNumber: process.env.twilioNumber,
        sendOutGoingText: function(response, receiver, _id, user, server) {
            this.processOutgoingSave(response, receiver, _id, user, server);
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
        processOutgoingSave: function(response, receiver, _id, username, server) {
            var formattedResponse = this.formatOutGoingResponseForSave(response, receiver, username);
            schemas.text.findByIdAndUpdate(
                _id, {
                    $set: {'textInformation.lastResponder': username}, 
                    $push: { 'textInformation.responders': formattedResponse }}, 
                    {multi: true}, 
                    function(err,data) {
                        if (err) console.log(appMessages.messageNotSaved);
            });
            this.addTextToUserAccount(formattedResponse, username);
        },
        addTextToUserAccount: function(respObj, username) {
            schemas.admin.update({username: username}, {$push: {messagesSent: respObj}}, function(err,data){
                if (err) console.log(appMessages.messageNotSaved);
            });
        },
        twilioSuccess: function(server, data) {
            server.send({result: appMessages.messageSent});
            console.log('Success!', data);
        },
        twilioError: function(server, data) {
            server.send({result: appMessages.messageNotSent});
            console.log('Error!', data);
        },
        formatOutGoingResponseForSave: function(response, to, user) {
            return {
                from: user,
                to: to,
                content: response,
                date: new Date()
            };
         },
    };

    return twilioWrapper;
};