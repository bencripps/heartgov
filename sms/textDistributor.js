/* 
* @Author: ben_cripps
* @Date:   2015-01-12 22:13:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-08 15:59:00
*/

module.exports = function(mongoose, TextSchema, appMessages, cityInfo) {
    'use strict';

    var textDistributor = {
        findTextsBy: function(filter, server) {
            this.execute(filter, server);
        },
        categories: Object.keys(appMessages.displayFields),
        buildQuery: function(filter) {
            var outgoingQuery = {'textInformation.visible': true};
            
            var location = cityInfo.filter(function(ob){ return ob.id === this.utils.getUserGroupName(filter.city); }, this)[0],
                twilNumber = Number(location.phoneNumber),
                tags = location.tags,
                currentTag = filter.tagId ? filter.tagId : tags[0].id;

            if (twilNumber) outgoingQuery = {'textInformation.visible': true, 'textInformation.toNumber': twilNumber, 'tag.id': currentTag};
        
            if (filter.search) this.buildSearch(outgoingQuery, filter.search);

            return outgoingQuery;
        },
        buildSearch: function(outgoingQuery, search) {

            if (search.phoneNumber) {
                outgoingQuery['userInformation.phoneNumber.string'] = { $regex:  '.*' + search.phoneNumber + '.*', $options: 'i' };
            }

        },
        execute: function(filter, server) {

            var query = this.buildQuery(filter);

            var location = cityInfo.filter(function(ob){ return ob.id === this.utils.getUserGroupName(filter.city); }, this)[0],
                skip = filter.startIndex * appMessages.pageSize,
                tags = location.tags,
                total = 0,
                me = this;

            var doQuery = function(total) {
                TextSchema.find(query).skip(skip).limit(appMessages.pageSize).sort({'textInformation.date': -1}).exec(function(err, items) {

                    if (!items || items.length === 0 ) {
                        me.returnTexts.call(me, server, [], 0, tags);
                        return false;
                    }
                    
                    if (!err) {
                        me.returnTexts.call(me, server, items, total, tags);
                    }
                    
                    else {
                        me.utils.dbError.call(me, server);
                    }   
                });
            };

            if (!filter.total) {
                TextSchema.find(query).exec(function(err, fullset) {
                    total = fullset.length;
                    doQuery(total);
                });
            }

            else {
                doQuery(filter.total);
            }

        },

        getTotal: function(query) {
            return TextSchema.find(query);
        },
        getTextObjectValues: function(text, name) {
             
            var configObject = {
                    userId: text.userInformation.userId || 'None Assigned',
                    date: new Date(text.userInformation.messageRecievedOn).toLocaleDateString() + ' ' + new Date(text.userInformation.messageRecievedOn).toLocaleTimeString(), //x.toLocaleDateString() + ' ' + x.toLocaleTimeString()
                    category: text.textInformation.category.name ? textDistributor.utils.capFirstLetter(text.textInformation.category.name) : 'None Assigned',
                    categoryId: text.textInformation.category.id || 'None Assigned',
                    lastResponder: text.textInformation.lastResponder ? text.textInformation.lastResponder : 'None Assigned',
                    allResponses: text.textInformation.responders,
                    status: text.textInformation.status || 'New',
                    trackingNumber: text.textInformation.trackingNumber || 'None Assigned',
                    zipCode: text.textInformation.location.fromZip || 'None Provided',
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
