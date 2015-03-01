define('groupModel', ['utilities'], function(utilities) {
    'use strict';

    var Group = {
            create: function(data) {

                var modelData = this.model(data),
                    groupModel = {
                        values: modelData,
                        save: this.liseners.save.bind(this, modelData)
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
                        values: group.associatedUsers.map(function(usr){
                            return {value: usr};
                        }),
                        id: 'assoc-users',
                        iterable: true,
                        visible: true,
                        editable: false,
                        label: 'Username'
                    },
                    {
                        values: group.associatedPhoneNumbers.map(function(num){
                            return {value: num};
                        }),
                        id: 'assoc-numbers',
                        iterable: true,
                        visible: true,
                        editable: false,
                        label: 'Phone Number'
                    }
                ];

                this.liseners.edit(data);
                return data;
            },
            liseners: {
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
                save: function(data) {
                    utilities.ajax(data, 'post', '/edit/group', function(response){
                        utilities.showModal(response);
                    });
                }
            },
            helpers: {
                attachEvent: function(form, ob, data){
                    var selector = document.querySelector('form[name="' + form + '"] input[name="'+ ob.id +'"]'),
                        eventId = selector.addEventListener('keyup', Group.liseners.editListener.bind(this, ob, data), false);
                }
            }
    };

    return Group;

});