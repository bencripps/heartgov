 /* 
* @Author: ben_cripps
* @Date:   2015-02-09 21:31:40
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-14 13:56:48
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

        },
        addGroupToDB: function(server, groupInfo, user) {
            var info = this.utils.getGroupSchema(groupInfo, user),
                model = new GroupSchema(info);
            
            model.save(
                this.utils.displayMessage.bind(this, server, appMessages.groupSuccessfullyCreated), 
                this.utils.displayMessage.bind(this, server, appMessages.errorOccurred));
        },
        utils: {
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