/* 
* @Author: ben_cripps
* @Date:   2015-07-27 20:13:12
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-10-05 19:59:21
*/


module.exports = function(mongoose, TextSchema, AdminSchema, shortId, appMessages) {
    'use strict';

    var redhookHandler = { 
        handleResponse: function(message, twilioWrapper) {
            this.handleOutgoingResponse(message, twilioWrapper);
        },

        handleOutgoingResponse: function(msg, twilioWrapper) {
            var outgoingMsg = appMessages.redhookConfig.questions[0];
            this.sendAndSave(msg, outgoingMsg, twilioWrapper);
        },

        sendAndSave: function(message, outGoingResponse, twilioWrapper) {

            var textModel = new TextSchema(this.getTextModel(message, outGoingResponse));

            textModel.save();

            twilioWrapper.sendOutGoingText(outGoingResponse, message.from, null, null, null, '/rh1/database');
        },

        formatOutGoingResponseForSave: function(response, to) {
            return {
                from: 'System',
                to: to,
                content: response
            };
        },

        getTextModel: function(message, outGoingResponse) {
                var cityInfo = appMessages.cities.filter(function(ob){ return ob.name === 'red-hook-initiative';})[0];

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
                        responders: [redhookHandler.formatOutGoingResponseForSave(outGoingResponse, message.from)],
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
            error: function(){
                console.log(arguments, 'error occurred');
            }
        }
    };

    return redhookHandler;

};