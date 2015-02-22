 /* 
* @Author: ben_cripps
* @Date:   2015-02-09 21:31:40
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-22 12:37:12
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
                this.utils.getGroups(null).then(
                    this.returnGroups.bind(this, server),
                    this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
            }

            else {
               this.utils.getGroups(
                    {$or: [{'creator.username': user.username}, 
                    {'associatedUsers': user.username}]})
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
        utils: {
            getGroups: function(filter) {
                if (filter) return GroupSchema.find(filter).exec();
                return GroupSchema.find().exec();
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