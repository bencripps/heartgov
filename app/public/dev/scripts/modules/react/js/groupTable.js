/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:06:18
*/

define('groupTable', ['react'], function(React){
    'use strict';
    
    var groupTable = {
        init: function(id, utils, service) {
            return React.render(React.createElement(this.table, {utils: utils, service: service}), document.getElementById(id));
        },
        table: React.createClass({displayName: "table",
            getInitialState: function() {
                return {
                    groups: [],
                    user: this.props.utils.getCurrentUserName(),
                    level: this.props.utils.getCurrentUserLevel(),
                    groupService: this.props.service
                }
            },
            componentWillMount: function(){
                var me = this;
                this.props.utils.ajax({username: this.props.utils.getCurrentUserName()}, 'post', '/find/availableGroups', function(data) { 
                    me.setState({groups: data.groups});
                });
            },
            render: function() {
                var groups = this.state.groups,
                    level = this.state.level,
                    groupInsert = groups.length >= 1 ? groups.map(function(group) { return React.createElement(groupTable.row, {info: group, level: level}) }) : React.createElement("tr", null, React.createElement("td", null, "There are no groups available at this time."));
                
                return (
                    React.createElement("table", {className: "table table-bordered table-striped", id: "group-table"}, 
                        React.createElement("tbody", null, 
                            groupInsert
                        )
                    )
                );
            }
        }),
        row: React.createClass({displayName: "row",
            render: function() {
                var editable = function(groupInfo) {
                    return this.state.level || this.state.user === groupInfo.creator.username;
                };
                var view = React.createElement(groupTable.viewButton, {group: this.props.info}),
                    options = editable.call(this._owner, this.props.info) ? [React.createElement(groupTable.deleteButton, {group: this.props.info}), React.createElement(groupTable.editButton, {group: this.props.info})] : [React.createElement(groupTable.emptyCell, null), React.createElement(groupTable.emptyCell, null)];
                return (
                    React.createElement("tr", null, 
                        view, 
                        options, 
                        React.createElement("td", null, this.props.info.groupName)
                    )
                );
            }
        }),
        emptyCell: React.createClass({displayName: "emptyCell", 
            render: function() {
                return (
                        React.createElement("td", null, 
                            React.createElement("span", null)
                        )
                    )
            }
        }),
        viewButton: React.createClass({displayName: "viewButton",
            render: function(){
                var view = function(group) {
                    this.state.groupService.viewGroupModal(group);
                };

                return (
                    React.createElement("td", {className: "group-button hgov-text-function"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-search", onClick: view.bind(this._owner._owner, this.props.group)})
                    )
                );
            }
        }),
        editButton: React.createClass({displayName: "editButton",
            render: function(){
                var edit = function(group) {
                    this.state.groupService.editGroupModal(group);
                };

                return (
                    React.createElement("td", {className: "group-button hgov-text-function"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-pencil", onClick: edit.bind(this._owner._owner, this.props.group)})
                    )
                );
            }
        }),
        deleteButton: React.createClass({displayName: "deleteButton",
            render: function(){
                var remove = function(group) {
                    this.state.groupService.removeGroupModal(group);
                };

                return ( 
                    React.createElement("td", {className: "group-button hgov-text-function"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-remove", onClick: remove.bind(this._owner._owner, this.props.group)})
                    )
                );
            }
        })
    };

    return groupTable;

});