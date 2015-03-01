 /* 
* @Author: ben_cripps
* @Date:   2015-02-09 21:31:40
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-03-01 17:33:52
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
                this.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyCreated), 
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        modifyGroupPhoneNumberList: function(method, groupInfo, server) {
            GroupSchema.findOneAndUpdate(
                {groupId: groupInfo.groupId},
                method === 'add' ? {$push: {associatedPhoneNumbers: groupInfo.phoneNumber}} : {$pull: {associatedPhoneNumbers: groupInfo.phoneNumber}},
                this.utils.displayMessage.bind(this, server, appMessages.phoneNumberSuccessfullyAdded),
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        modifyPhoneNumbers: function(server, method, group) {
            console.log(group, method);
        },
        updateGroup: function(data, server) {
            var id = this.utils.getGroupValue(data, 'id'),
                orgName = this.utils.getGroupValue(data, 'organizationName'),
                groupName = this.utils.getGroupValue(data, 'groupName');

            GroupSchema.findOneAndUpdate({_id: id}, 
                {groupName: groupName, 'organization.name': orgName}, 
                groupManager.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyUpdated), 
                groupManager.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        deleteGroup: function(id, server) {
            GroupSchema.findOneAndUpdate({_id: id}, 
                    {visible: false}, 
                    groupManager.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyDeleted), 
                    groupManager.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        utils: {
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
            displayMessage: function(server, msg) {
                server.send({result: msg});
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
            }
        }
    };

    return groupManager;

};