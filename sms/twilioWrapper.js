/*
* @Author: ben_cripps
* @Date:   2015-01-09 21:59:31
* @Last Modified by:   ben_cripps
* @Last Modified time: 2016-01-29 09:35:13
*/

module.exports = function(client, appMessages, schemas) {
    'use strict';

    var twilioWrapper = {
        brooklynNumber: process.env.brooklynNumber,
        austinNumber: process.env.austinNumber,
        redhookNumner: process.env.redhookNumber,
        haverhillNumber: process.env.haverhillNumber,
        sendOutGoingText: function(response, receiver, _id, user, server, city, isGroupMessage) {

            if (_id) this.processOutgoingSave(response, receiver, _id, user, server);

            this.processOutGoingText(response, receiver, city, server, isGroupMessage);
        },
        sendGroupOutGoingText: function(groupManager, msgData, server, city) {
            groupManager.utils.getPhoneNumbers(msgData.groupId).then(function(record) {
                var numbers = record[0].associatedPhoneNumbers;

                numbers.forEach(function(num, i) {
                    // twil totes dont wanna be spammed, so let's chunk it out
                    setTimeout(function() {
                        twilioWrapper.sendOutGoingText(msgData.message, num, null, msgData.user, server, city, true);
                    }, i * 1000);
                });
            });
        },
        processOutGoingText: function(response, receiver, city, server, isGroupMessage) {

            var number = this.getNumberForCity(city);

            var sms = client.messages.create({
                    to: receiver,
                    from: number,
                    body: response
                }, function() {
                    if (!isGroupMessage && server) {
                        server.send({result: appMessages.messageSent});
                    }
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
        getNumberForCity: function(identifier) {

            var number;

            // if were texting from a group page, just use the austin number
            if (identifier && identifier.indexOf('/groups') !== -1) {
                number = process.env.austinNumber;
            }

            else {
                switch(identifier) {

                    case '/austin/database':
                        number = process.env.austinNumber;
                        break;
                    case '/brooklyn/database':
                        number = process.env.brooklynNumber;
                        break;
                    case '/rh1/database':
                        number = process.env.redhookNumber;
                        break;
                    case '/councilmatic/database':
                        number = process.env.councilmaticNumber;
                        break;
                    case '/austinNew/database':
                        number = process.env.austinNewNumber;
                        break;
                    case '/haverhill/database':
                        number = process.env.haverhillNumber;
                        break;
                    default:
                        throw Error('This city has not been defined in the Twilio Wrapper Model');

                }
            }


            return number;

        }

    };

    return twilioWrapper;
};