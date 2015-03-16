define('groupModel', ['utilities'], function(utilities) {
    'use strict';

    var Group = {
            create: function(data, reactTable) {

                var modelData = this.model(data),
                    groupModel = {
                        values: modelData,
                        save: this.listeners.save.bind(this, modelData)
                    };

                return groupModel;
            },
            model: function(group) {
                var data =  [
                    {
                        id: 'id',
                        visible: false,
                        editable: false,
                        internalValue: group._id,
                        value: group._id,
                        label: 'id'
                    },
                    {
                        id: 'creatorEmailAddress',
                        visible: true,
                        editable: false,
                        internalValue: group.creator.emailAddress,
                        value: group.creator.emailAddress,
                        label: 'Creator Email Address'
                    },
                    {
                        id: 'creatorId',
                        visible: false,
                        editable: false,
                        value: group.creator.id,
                        label: 'Creator Id'
                    },
                    {
                        id: 'creatorUsername',
                        visible: true,
                        editable: false,
                        internalValue: group.creator.username,
                        value: group.creator.username,
                        label: 'Creator Username'
                    },
                    {
                        id: 'dateCreated',
                        visible: true,
                        editable: false,
                        internalValue: group.dateCreated,
                        value: new Date(group.dateCreated),
                        label: 'Date Created'
                    },
                    {
                        id: 'groupId',
                        visible: false,
                        editable: false,
                        internalValue: group.groupId,
                        value: group.groupId,
                        label: 'Group Id'
                    },
                    {
                        id: 'groupName',
                        visible: true,
                        editable: true,
                        internalValue: group.groupName,
                        value: group.groupName,
                        label: 'Group Name'
                    },
                    {
                        id: 'organizationId',
                        visible: false,
                        editable: false,
                        internalValue: group.organization.id,
                        value: group.organization.id,
                        label: 'Group Id'
                    },
                    {
                        id: 'organizationName',
                        visible: true,
                        editable: true,
                        internalValue: group.organization.name,
                        value: group.organization.name,
                        label: 'Organization Name'
                    },
                    {
                        value: group.associatedUsers.map(function(usr){
                            return {value: usr};
                        }),
                        id: 'assoc-users',
                        iterable: true,
                        visible: true,
                        editable: false,
                        label: 'Username',
                        validator: function(val) { return val.length > 4;}
                    },
                    {
                        value: group.associatedPhoneNumbers.map(function(num){
                            return {value: num};
                        }),
                        id: 'assoc-numbers',
                        iterable: true,
                        visible: true,
                        editable: false,
                        label: 'Phone Number',
                        validator: function(val) { return val.length === 10;}
                    }
                ];

                this.listeners.edit(data);
                return data;
            },
            listeners: {
                edit: function(data) {
                    data.forEach(function(ob){
                        if (ob.visible && ob.editable && !ob.iterable) {
                            Group.helpers.attachEvent('group-details-form', ob, data);
                        }
                    });
                },
                editListener: function(ob, data, e) {
                    if (!ob.iterable) data[data.map(function(o){ return o.id; }).indexOf(e.target.name)].value = e.target.value;
                },
                save: function(data, reactTable) {
                    utilities.ajax({ data: this.helpers.saveUsersAndNumbers(data), username: utilities.getCurrentUserName()},'post', '/edit/group', function(response){
                        if (!response.result) {
                            utilities.showModal({result: 'This group has been successfully updated!'});
                            reactTable.setState({groups: response.groups});
                        }
                        else {
                            utilities.showModal(response);
                        }
                    });
                }
            },
            helpers: {
                attachEvent: function(form, ob, data){
                    var selector = document.querySelector('form[name="' + form + '"] input[name="'+ ob.id +'"]'),
                        eventId = selector.addEventListener('keyup', Group.listeners.editListener.bind(this, ob, data), false);
                },
                saveUsersAndNumbers: function(data) {
                    data.filter(function(n){return n.iterable;}).forEach(function(ob){
                        var temp = [],
                            idx = data.map(function(y){return y.id;}).indexOf(ob.id);
                            
                        Array.prototype.forEach.call(document.querySelectorAll('form[name="' + ob.id + '"] input'), function(input) {
                            if (ob.validator(input.value)){
                                temp.push(input.value);
                            }
                        });
                        
                        data[idx].value = temp;
                    });
                    return data;
                }
            }
    };

    return Group;

});