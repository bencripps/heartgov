/* 
* @Author: ben_cripps
* @Date:   2015-07-27 20:13:12
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-10-09 17:04:12
*/


module.exports = function(mongoose, TextSchema, AdminSchema, shortId, appMessages) {
    'use strict';

    var councilHandler = { 
        handleResponse: function(message, twilioWrapper) {
            this.utils.getResponseType(message).then(this.handleOutgoingResponse.bind(this, message, twilioWrapper), this.utils.error.bind(this));
        },

        handleOutgoingResponse: function(msg, twilioWrapper, previousMessages) {

            var outgoingMsg;

            if (previousMessages && previousMessages.length > 0) {
                outgoingMsg = appMessages.councilConfig.questions[1];
            }

            else {
                outgoingMsg = appMessages.councilConfig.questions[0];
            }

            this.sendAndSave(msg, outgoingMsg, twilioWrapper);
        },

        sendAndSave: function(message, outGoingResponse, twilioWrapper) {

            var textModel = new TextSchema(this.getTextModel(message, outGoingResponse));

            textModel.save();

            twilioWrapper.sendOutGoingText(outGoingResponse, message.from, null, null, null, '/councilmatic/database');
        },

        formatOutGoingResponseForSave: function(response, to) {
            return {
                from: 'System',
                to: to,
                content: response
            };
        },

        getTextModel: function(message, outGoingResponse) {
                var cityInfo = appMessages.cities.filter(function(ob){ return ob.name === 'councilmatic';})[0];

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
                        responders: [councilHandler.formatOutGoingResponseForSave(outGoingResponse, message.from)],
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
                var cityInfo = appMessages.cities.filter(function(ob){ return ob.name === 'councilmatic';})[0];

                return TextSchema.find({'tag.id': cityInfo.tags[0].id, 'textInformation.toNumber': msg.to, 'userInformation.phoneNumber.string': String(msg.from)}).exec();            
            },
            error: function(){
                console.log(arguments, 'error occurred');
            }
        }
    };

    return councilHandler;

};