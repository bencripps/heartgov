/*
* @Author: ben_cripps
* @Date:   2015-07-27 20:13:12
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-19 06:13:02
*/


module.exports = function(mongoose, TextSchema, AdminSchema, shortId, appMessages) {
    'use strict';

    var austinNewHandler = {
        handleResponse: function(message, twilioWrapper) {
            this.utils.getResponseType(message).then(this.handleOutgoingResponse.bind(this, message, twilioWrapper), this.utils.error.bind(this));
        },

        handleOutgoingResponse: function(msg, twilioWrapper, previousMessages) {

            var outgoingMsg;

            if (previousMessages.length < appMessages.austinNewConfig.questions.length) {
                outgoingMsg = appMessages.austinNewConfig.questions[previousMessages.length];
            }

            else {
                outgoingMsg = appMessages.austinNewConfig.questions[appMessages.austinNew.questions.length - 1];
            }

            this.sendAndSave(msg, outgoingMsg, twilioWrapper);
        },

        sendAndSave: function(message, outGoingResponse, twilioWrapper) {

            var textModel = new TextSchema(this.getTextModel(message, outGoingResponse));

            textModel.save();

            twilioWrapper.sendOutGoingText(outGoingResponse, message.from, null, null, null, '/austinNew/database');
        },

        formatOutGoingResponseForSave: function(response, to) {
            return {
                from: 'System',
                to: to,
                content: response
            };
        },

        getTextModel: function(message, outGoingResponse) {
                var cityInfo = appMessages.cities.filter(function(ob){ return ob.name === 'austin-new';})[0];

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
                    tag: {
                        cityName: cityInfo.name,
                        name: cityInfo.tags[0].name,
                        id: cityInfo.tags[0].id
                    },
                    textInformation: {
                        category: {
                            id: null,
                            name: null
                        },
                        body: message.body,
                        status: null,
                        zipcode: null,
                        responders: [austinNewHandler.formatOutGoingResponseForSave(outGoingResponse, message.from)],
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
                var cityInfo = appMessages.cities.filter(function(ob){ return ob.name === 'austin-new';})[0];

                return TextSchema.find({'tag.id': cityInfo.tags[0].id, 'textInformation.toNumber': msg.to, 'userInformation.phoneNumber.string': String(msg.from)}).exec();
            },
            error: function(){
                console.log(arguments, 'error occurred');
            }
        }
    };

    return austinNewHandler;

};