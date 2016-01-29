/*
* @Author: ben_cripps
* @Date:   2015-01-08 20:16:46
* @Last Modified by:   ben_cripps
* @Last Modified time: 2016-01-28 19:27:21
*/

module.exports = function(mongoose, idGenerator, schemas, messageConfig, mailer, austinHandler, redhookHandler, councilmaticHandler, austinNewHandler, havernhillHandler) {
    'use strict';

    var textReceiver = {

        doTestEmail: function(incomingMessage, twilioWrapper) {
            var message = this.utils.translateTwilioModel(incomingMessage);

            mailer.sendMailtoAssociatedUsers('newTextReceived', {textDetails: message});
        },

        handleResponse: function(incomingMessage, twilioWrapper) {

            var message = this.utils.translateTwilioModel(incomingMessage);

            mailer.sendMailtoAssociatedUsers('newTextReceived', {textDetails: message});

            //austin
            if (message.to === '+' + process.env.austinNumber) {
                austinHandler.handleResponse(message, twilioWrapper);
            }

            //brookyln
            else if (message.to === '+' + process.env.brooklynNumber) {
                if (this.user.hasTrackingNumber(message.body)) {
                    this.utils.findText('textInformation.trackingNumber', this.utils.getId(message.body))
                        .then(this.responder.withTrackingNumber.bind(this, message, twilioWrapper));
                }

                else {
                    this.user.isNewOrOldTexter(message.from)
                        .then(this.responder.withoutTrackingNumber.bind(this, message, twilioWrapper));
                }
            }

            //councilmatic
            else if (message.to === '+' + process.env.councilmaticNumber) {
                councilmaticHandler.handleResponse(message, twilioWrapper);
            }
            //redhook
            else if (message.to === '+' + process.env.redhookNumber) {
                redhookHandler.handleResponse(message, twilioWrapper);
            }
            //austin new
            else if (message.to === '+' + process.env.austinNewNumber) {
                austinNewHandler.handleResponse(message, twilioWrapper);
            }

            //havernhill
            else if (message.to === '+' + process.env.haverhillNumber) {
                havernhillHandler.handleResponse(message, twilioWrapper);
            }

            else {
                console.log('Number not established', message.to);
            }
        },
        responder: {
            withTrackingNumber: function(message, twil, data, err) {
                var outGoingResponse;

                if (data.length >= 1) {
                    outGoingResponse = messageConfig.textResponses.trackingNumberFound;
                    twil.sendOutGoingText(outGoingResponse, message.from);
                    textReceiver.message.save(message, 'getTextModel', outGoingResponse, textReceiver.utils.getId(message.body));
                }

                else if (err) { textReceiver.utils.errorOccured(err); }

                else {
                    outGoingResponse = messageConfig.textResponses.trackingNumberNotFound;
                    twil.sendOutGoingText(outGoingResponse, message.from);
                    textReceiver.message.save(message, 'getTextModel', outGoingResponse);
                }
            },
            withoutTrackingNumber: function(message, twil, data, err) {
                var outGoingResponse;

                if (err) { textReceiver.utils.errorOccured(err); }

                else {

                    if (data.length >= 1) {
                        outGoingResponse = messageConfig.textResponses.repeatTexter;
                        twil.sendOutGoingText(outGoingResponse, message.from);
                        textReceiver.message.save(message, 'getTextModel', outGoingResponse);
                    }

                    else {
                        outGoingResponse = textReceiver.user.newToSiteResponse();
                        twil.sendOutGoingText(outGoingResponse, message.from);
                        textReceiver.message.save(message, 'getTextModel', outGoingResponse);
                    }
                }
            }
        },
        user: {
            newToSiteResponse: function() {
                return messageConfig.textResponses.firstTexter + messageConfig.textResponses.listCategories + textReceiver.utils.listCategories(messageConfig.categories);
            },
            hasTrackingNumber: function(body) {
                var test = textReceiver.utils.idRegex(body),
                    isCorrect = test && textReceiver.utils.getId(body).length === 8;

                return isCorrect;
            },
            isNewTexter: function(from) {
                return true;
            },
            isRepeatTexter: function(from){
                var userNumberFound = textReceiver.utils.findText('userInformation.phoneNumber.string', from);
                return userNumberFound;
            },
            isNewOrOldTexter: function(from) {
                return textReceiver.utils.findText('userInformation.phoneNumber.string', from);
            }
        },
        message: {
            isNotFormattedCorrectly: function() {

            },
            isCorrectlyFormatted: function() {

            },
            save: function(message, method, outGoingResponse, assocciatedTrackingNumber) {
                var info = textReceiver.utils[method](message, outGoingResponse, assocciatedTrackingNumber),
                    model = new schemas.text(info);

                model.save();
            },
            delete: function() {

            }
        },
        utils: {
            idRegex: function(body) {
                return /#.{8}/.exec(body);
            },
            getCategory: function(body) {
                var re = /\([0-4]\)/.exec(body);
                if (re) {
                    return re.input.substring(re.index + 2, re.index + 1);
                }
                else {
                    return false;
                }
            },
            mentionsCategory: function(body) {
                if (/\([0-4]\)/.exec(body)) return true;
            },
            getId: function(body) {
                var idRegex = this.idRegex(body);
                if (idRegex && Array.isArray(idRegex)) {
                    return idRegex[0].replace(' ', '').length === 9 ? idRegex[0].substring(1) : false;
                }
                else {
                    return false;
                }
            },
            listCategories: function(cats) {
                return cats.map(function(a,b) {return b + 1 + ' ' + a;}).join(', ');
            },
            getTextModel: function(message, outGoingResponse, assocciatedTrackingNumber) {

                var cityInfo = messageConfig.cities.filter(function(ob){ return ob.name === 'brooklyn';})[0];

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
                            id: textReceiver.utils.mentionsCategory(message.body) ? textReceiver.utils.getCategory(message.body): null,
                            name: textReceiver.utils.mentionsCategory(message.body) ? messageConfig.categories[textReceiver.utils.getCategory(message.body) - 1]: null,
                        },
                        body: message.body,
                        status: null,
                        zipcode: null,
                        responders: [textReceiver.utils.formatOutGoingResponseForSave(outGoingResponse, message.from)],
                        lastResponder: 'System',
                        trackingNumber: assocciatedTrackingNumber || null,
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
            translateTwilioModel: function(msg) {
                return {
                    to: msg.To,
                    from: msg.From,
                    body: msg.Body,
                    fromCity: msg.FromCity,
                    fromState: msg.FromState,
                    fromZip: msg.FromZip,
                    fromCountry: msg.FromCountry,
                    toCity: msg.ToCity,
                    toState: msg.ToState,
                    toZip: msg.ToZip,
                    toCountry: msg.ToCountry,
                    sid: msg.MessageSid
                };
            },
            formatOutGoingResponseForSave: function(response, to) {
                return {
                    from: 'System',
                    to: to,
                    content: response
                };
            },
            findText: function(key, value) {
                var obj = {};
                obj[key] = value;
                return schemas.text.find(obj).exec();
            },
            errorOccured: function(err) {
                console.log('Error occured!', err);
            }
        }
    };

    return textReceiver;
};