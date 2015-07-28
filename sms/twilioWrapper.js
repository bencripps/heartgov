/* 
* @Author: ben_cripps
* @Date:   2015-01-09 21:59:31
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-27 21:49:07
*/

module.exports = function(client, appMessages, schemas) {
    'use strict';
    
    var twilioWrapper = {
        brooklynNumber: process.env.brooklynNumber,
        austinNumber: process.env.austinNumber,
        sendOutGoingText: function(response, receiver, _id, user, server, city) {
            //need to fix this, but will work for now?
            city = city ? city : '/brooklyn';
            if (_id) this.processOutgoingSave(response, receiver, _id, user, server);
            this.processOutGoingText(response, receiver, city).then(this.twilioSuccess.bind(this, server), this.twilioError.bind(this,server));
        },
        sendGroupOutGoingText: function(groupManager, msgData, server, city) {
            groupManager.utils.getPhoneNumbers(msgData.groupId).then(function(record) {
                var numbers = record[0].associatedPhoneNumbers;

                numbers.forEach(function(num) {
                    twilioWrapper.sendOutGoingText(msgData.message, num, null, msgData.user, server, city);
                });
            });
        },
        processOutGoingText: function(response, receiver, city) {

            var sms = client.sms.messages.create({
                    to: receiver,
                    from: city.substring(0,7) === '/austin' ? this.austinNumber : this.brooklynNumber,
                    body: response
                });

            return sms;
        },
        processOutgoingSave: function(response, receiver, _id, username, server) {
            var formattedResponse = this.formatOutGoingResponseForSave(response, receiver, username);
            schemas.text.findByIdAndUpdate(
                _id, {
                    $set: {'textInformation.lastResponder': username}, 
                    $push: {'textInformation.responders': formattedResponse}}, 
                    {multi: true}, 
                    function(err) {
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