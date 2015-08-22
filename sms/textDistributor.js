/* 
* @Author: ben_cripps
* @Date:   2015-01-12 22:13:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-08-22 12:39:43
*/

module.exports = function(mongoose, TextSchema, appMessages, cityInfo) {
    'use strict';

    var textDistributor = {
        findTextsBy: function(filter, server) {
            this.execute(filter, server);
        },
        categories: Object.keys(appMessages.displayFields),
        execute: function(filter, server) {

            var twilNumber = filter && this.utils.getUserGroupName(filter.city) === 'austin' ?  Number(process.env.austinNumber) : Number(process.env.brooklynNumber),
                query = {'textInformation.visible': true},
                skip = filter.startIndex * appMessages.pageSize,
                tags = cityInfo.filter(function(ob){ return ob.name === this.utils.getUserGroupName(filter.city); }, this)[0].tags,
                currentTag = filter.tagId ? filter.tagId : tags[0].id,
                me = this;

            if (twilNumber) query = {'textInformation.visible': true, 'textInformation.toNumber': twilNumber, 'textInformation.tag.id': currentTag};

            TextSchema.find(query).exec(function(err, items) {

                var total = items.length,
                    docs = items.slice(skip, appMessages.pageSize + skip);
                
                if (!err) {
                    me.returnTexts.call(me, server, docs, total, tags);
                }
                
                else {
                    me.utils.dbError.call(me, server);
                }   
            });
        },
        getTextObjectValues: function(text, name) {
             
            var configObject = {
                    userId: text.userInformation.userId || 'None Assigned',
                    date: new Date(text.userInformation.messageRecievedOn).toDateString(),
                    category: text.textInformation.category.name ? textDistributor.utils.capFirstLetter(text.textInformation.category.name) : 'None Assigned',
                    categoryId: text.textInformation.category.id || 'None Assigned',
                    lastResponder: text.textInformation.lastResponder ? text.textInformation.lastResponder : 'None Assigned',
                    allResponses: text.textInformation.responders,
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
        returnTexts: function(server, data, total, tags) {
            var ret = [],
                textObj = {};

            data.forEach(function(text){
               textDistributor.categories.forEach(function(name){
                    textObj[name] = textDistributor.getTextObjectValues(text, name);
               });
               ret.push(textObj);
               textObj= {};
            });

            server.send({result: ret, count: total, tags: tags});

        },
        textSuccessfullyDeleted: function(server) {
            server.send({result: appMessages.textSuccessfullyDeteted, code: appMessages.successCode});
        },
        utils: {
            dbError: function(server, err) {
                console.log('Error!', err);
                server.send({result: appMessages.errorOccurred, code: appMessages.failCode});
            },
            capFirstLetter: function(str){
                return str.charAt(0).toUpperCase() + str.slice(1);
            },
            deleteText: function(id, server) {
                TextSchema.findOneAndUpdate({_id: id}, 
                    {'textInformation.visible': false}, 
                    textDistributor.textSuccessfullyDeleted.bind(this, server), 
                    this.dbError.bind(this,server));
            },
            getUserGroupName: function(str) {
                return str.replace('/database', '').replace('/', '');
            }
        }
    };

    return textDistributor;
};
