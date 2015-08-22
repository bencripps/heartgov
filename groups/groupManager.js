 /* 
* @Author: ben_cripps
* @Date:   2015-02-09 21:31:40
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-08-23 13:00:42
*/

module.exports = function(mongoose, myAccount, GroupSchema, shortId, appMessages) {
    'use strict';

    var groupManager = {
        createGroup: function(groupInfo, server) {
            this.utils.doesGroupNameExist(groupInfo.groupName)
                .then(
                    this.handleCreateAttempt.bind(this, server, groupInfo), 
                    this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));  
        },
        handleCreateAttempt: function(server, groupInfo, groupFound) {
            if (groupFound){
                this.utils.displayMessage(server, appMessages.groupNameAlreadyExists);
            }
            else {
                myAccount.getUser(groupInfo.creator)
                    .then(
                        this.addGroupToDB.bind(this, server, groupInfo),
                        this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));  
            }
        },
        findAvailableGroups: function(username, server){
            myAccount.getUser(username)
                    .then(
                        this.distributeGroups.bind(this, server),
                        this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));  

        },
        returnGroups: function(server, groups) {
            server.send({groups: groups});
        },
        importNumbers: function(obj, server) {
            var _this = this;

            this.utils.getGroups({_id: obj.group}).then(function(group, err) {
                _this.modifyPhoneNumbers(
                    _this.utils.getUniqueNumbers(group[0].associatedPhoneNumbers, obj.data), 
                    obj.group, server);
            });
            
        },
        distributeGroups: function(server, user){
            if (user.superUser){
                this.utils.getGroups({visible: true}).then(
                    this.returnGroups.bind(this, server),
                    this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
            }

            else {
               this.utils.getGroups(
                    {$and: [{visible: true},
                    {$or: [{'creator.username': user.username}, {'associatedUsers': user.username}]}]})
                        .then(
                            this.returnGroups.bind(this, server),
                            this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
            }
        },
        addGroupToDB: function(server, groupInfo, user) {
            var info = this.utils.getGroupSchema(groupInfo, user),
                model = new GroupSchema(info);
            
            model.save(
                this.distributeGroups.bind(this, server, user), 
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        modifyGroupPhoneNumberList: function(method, groupInfo, server) {
            GroupSchema.findOneAndUpdate(
                {groupId: groupInfo.groupId},
                method === 'add' ? {$push: {associatedPhoneNumbers: groupInfo.phoneNumber}} : {$pull: {associatedPhoneNumbers: groupInfo.phoneNumber}},
                this.utils.displayMessage.bind(this, server, appMessages.phoneNumberSuccessfullyAdded),
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        modifyPhoneNumbers: function(nums, id, server) {
            GroupSchema.findOneAndUpdate(
                {_id: id}, 
                {associatedPhoneNumbers: nums},
                this.utils.displayMessage.bind(this, server, appMessages.phoneNumberSuccessfullyAdded),
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        updateGroup: function(obj, server) {
            var data = obj.data,
                user = obj.username,
                id = this.utils.getGroupValue(data, 'id'),
                orgName = this.utils.getGroupValue(data, 'organizationName'),
                groupName = this.utils.getGroupValue(data, 'groupName'),
                phoneNumbers = this.utils.getGroupValue(data, 'assoc-numbers'),
                users = this.utils.getGroupValue(data, 'assoc-users');

            GroupSchema.findOneAndUpdate({_id: id}, 
                {groupName: groupName, 'organization.name': orgName, associatedPhoneNumbers: phoneNumbers, associatedUsers: users}, 
                groupManager.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyUpdated, user), 
                groupManager.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        deleteGroup: function(id, server) {
            GroupSchema.findOneAndUpdate({_id: id}, 
                    {visible: false}, 
                    groupManager.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyDeleted), 
                    groupManager.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        utils: {
            getUniqueNumbers: function(existing, newNums) {
                var tempArr = newNums.split('\r').filter(groupManager.utils.numberValidator);
                return existing.concat(tempArr.filter(function(z) { return existing.indexOf(z) < 0;}));
            },
            getGroups: function(filter) {
                if (filter) return GroupSchema.find(filter).exec();
                return GroupSchema.find().exec();
            },
            getGroupValue: function(data, key) {
                return data[data.map(function(ob){ return ob.id; }).indexOf(key)].value;
            },
            doesGroupNameExist: function(groupName) {
                return GroupSchema.findOne({groupName: groupName}).exec();
            },
            displayMessage: function(server, msg, username) {

                if (username) {
                    this.findAvailableGroups(username, server);
                }

                else {
                    server.send({result: msg});
                }
            },
            numberValidator: function(num) {
                return parseInt(num) && num.length === 10;
            },
            getGroupSchema: function(groupInfo, user) {
                return {
                    groupId: shortId.getId(),
                    groupName: groupInfo.groupName,
                    organization: {
                        id: null,
                        name: groupInfo.organization
                    },
                    associatedPhoneNumbers: [],
                    associatedUsers: [],
                    creator: {
                        username: user.username,
                        id: user.userId,
                        emailAddress: user.emailAddress
                    }
                };
            },
            getPhoneNumbers: function(id) {
               return GroupSchema.find({_id: id}).exec();
            }
        }
    };

    return groupManager;

};