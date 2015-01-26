/* 
* @Author: ben_cripps
* @Date:   2015-01-12 22:13:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-25 17:06:23
*/

/*jslint node: true */

module.exports = function(mongoose, TextSchema, appMessages) {
    'use strict';

    var textDistributor = {
        findTextsBy: function(filter, server) {
            this.execute(filter).then( this.returnTexts.bind(this, server), this.utils.dbError.bind(this, server));
        },
        categories: Object.keys(appMessages.displayFields),
        execute: function(filter) {
            return TextSchema.find().sort(filter).exec();
        },
        getTextObjectValues: function(text, name) {
             
            var configObject = {
                    userId: text.userInformation.userId || 'None Assigned',
                    date: new Date(text.userInformation.messageRecievedOn).toDateString(),
                    category: text.textInformation.category.name ? textDistributor.utils.capFirstLetter(text.textInformation.category.name) : 'None Assigned',
                    categoryId: text.textInformation.category.id || 'None Assigned',
                    lastResponder: text.textInformation.lastResponder ? text.textInformation.lastResponder : 'None Assigned',
                    allResponses: text.textInformation.responders.length,
                    status: text.textInformation.status || 'New',
                    trackingNumber: text.textInformation.trackingNumber || 'None Assigned',
                    zipCode: text.textInformation.zipcode || 'None Provided',
                    name: text.userInformation.name || 'None Provided',
                    phoneNumber: text.userInformation.phoneNumber.string,
                    content: text.textInformation.body,
                    _id: text._id,
                    searchable: text.textInformation.searchable
                 };

            return configObject[name];
        },
        returnTexts: function(server, data) {
            var ret = [],
                textObj = {};

            data.forEach(function(text){
               textDistributor.categories.forEach(function(name){
                    textObj[name] = textDistributor.getTextObjectValues(text, name);
               });
               ret.push(textObj);
               textObj= {};
            });

            server.send({result: ret, displayTemplate: appMessages.displayBarTemplate, innerLayoutTemplate: appMessages.innerLayoutTemplate });

        },
        utils: {
            dbError: function(server, err) {
                console.log('Error!', err);
                server.send({result: appMessages.errorOccurred, code: appMessages.failCode});
            },
            capFirstLetter: function(str){
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
        }
    };

    return textDistributor;
};
