/* 
* @Author: ben_cripps
* @Date:   2015-01-12 22:13:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-01-16 21:00:36
*/

/*jslint node: true */

module.exports = function(mongoose, TextSchema, appMessages) {
    'use strict';

    var textDistributor = {
        findTextsBy: function(filter, server) {
            this.execute().then( this.returnTexts.bind(this, server), this.utils.dbError.bind(this, server));
        },
        categories: Object.keys(appMessages.displayFields),//.map(function(k) { return appMessages.displayFields[k].name; }),
        execute: function(filter) {
            return TextSchema.find({}).exec();
        },
        getTextObjectValues: function(text, name) {
             
            var configObject = {
                    userId: text.userInformation.userId || 'None Assigned',
                    date: new Date(text.userInformation.messageRecievedOn).toDateString(),
                    category: text.textInformation.category.name ? textDistributor.utils.capFirstLetter(text.textInformation.category.name) : 'None Assigned',
                    categoryId: text.textInformation.category.id || 'None Assigned',
                    lastResponder: text.textInformation.lastResponder.length < 1 ? 'None Assigned' : text.textInformation.lastResponder[0],
                    allResponses: text.textInformation.responders.length,
                    status: text.textInformation.status || 'New',
                    trackingNumber: text.textInformation.trackingNumber || 'None Assigned',
                    zipCode: text.textInformation.zipcode || 'None Provided',
                    name: text.userInformation.name || 'None Provided',
                    phoneNumber: text.userInformation.phoneNumber.string,
                    content: text.textInformation.body,
                    searchable: text.textInformation.searchable
                 };

            return configObject[name];
        },
        returnTexts: function(server, data) {
            var ret = [],
                textObj = [];

            data.forEach(function(text){
               textDistributor.categories.forEach(function(name){
                    textObj.push(textDistributor.getTextObjectValues(text, name));
               });
               ret.push(textObj);
               textObj= [];
            });

            server.send({result: ret, template: appMessages.displayBarTemplate });

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
