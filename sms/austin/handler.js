/* 
* @Author: ben_cripps
* @Date:   2015-07-27 20:13:12
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-07-27 21:44:10
*/


module.exports = function(mongoose, TextSchema, AdminSchema, shortId, appMessages) {
    'use strict';

    var austinHandler = { 
        handleResponse: function(message, twilioWrapper) {
            
            this.utils.getResponseType(message).then(this.handleOutgoingResponse.bind(this, message, twilioWrapper), this.utils.error.bind(this));
        },

        handleOutgoingResponse: function(msg, twilioWrapper, previousMessages) {
            var outgoingMsg;
            
            if (previousMessages.length >= appMessages.austinConfig.questions.length) {
                outgoingMsg = appMessages.austinConfig.questions[appMessages.austinConfig.questions.length];
            }

            else {
                outgoingMsg = appMessages.austinConfig.questions[previousMessages.length];
            }

            this.sendAndSave(msg, outgoingMsg, twilioWrapper);
        },

        sendAndSave: function(message, outGoingResponse, twilioWrapper) {

            var textModel = new TextSchema(this.getTextModel(message, outGoingResponse));

            textModel.save();

            // this doesnt seem to work -- find out why twilio isnt sending our message;
            twilioWrapper.sendOutGoingText(outGoingResponse, message.from, null, null, null, '/austin');
        },

        formatOutGoingResponseForSave: function(response, to) {
            return {
                from: 'System',
                to: to,
                content: response
            };
        },

        getTextModel: function(message, outGoingResponse) {

                return {
                    userInformation: {
                        userId: null,
                        name: null,
                        zipcode: null,
                        phoneNumber: {
                            string: message.from,
                            number: Number(message.from)
                        }
                    },
                    textInformation: {
                        category: {
                            id: null,
                            name: null
                        },
                        body: message.body,
                        status: null,
                        zipcode: null,
                        responders: [austinHandler.formatOutGoingResponseForSave(outGoingResponse, message.from)],
                        lastResponder: 'System',
                        trackingNumber: null,
                        sid: message.sid,
                        searchable: message.body.split(' '),
                        toNumber: message.to,
                        location: {
                            fromCity: message.fromCity,
                            fromState: message.fromState,
                            fromZip: message.fromZip,
                            fromCountry: message.fromCountry,
                            toCity: message.toCity,
                            toState: message.toState,
                            toZip: message.toZip,
                            toCountry: message.toCountry,
                        }
                    }
                };
            },

        utils: {
            getResponseType: function(msg) {
                return TextSchema.find({'textInformation.toNumber': msg.to, 'userInformation.phoneNumber.string': String(msg.from)}).exec();            
            },
            error: function(){
                console.log(arguments, 'error occurred');
            }
        }
    };

    return austinHandler;

};