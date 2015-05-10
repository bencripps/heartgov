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
            return React.render(<this.table utils={utils} service={service}/>, document.getElementById(id));
        },
        table: React.createClass({
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
                    groupInsert = groups.length >= 1 ? groups.map(function(group) { return <groupTable.row info={group} level={level} /> }) : <tr><td>There are no groups available at this time.</td></tr>;
                
                return (
                    <table className='table table-bordered table-striped' id='group-table'>
                        <tbody>
                            {groupInsert}
                        </tbody>
                    </table>
                );
            }
        }),
        row: React.createClass({
            render: function() {
                var editable = function(groupInfo) {
                    return this.state.level || this.state.user === groupInfo.creator.username;
                };
                var view = <groupTable.viewButton group={this.props.info} />,
                    options = editable.call(this._owner, this.props.info) ? [<groupTable.deleteButton group={this.props.info} />, <groupTable.editButton group={this.props.info} />, <groupTable.sendButton group={this.props.info} />] : [<groupTable.emptyCell />, <groupTable.emptyCell />];
                return (
                    <tr>
                        {view}
                        {options}
                        <td>{this.props.info.groupName}</td>
                    </tr>
                );
            }
        }),
        emptyCell: React.createClass({ 
            render: function() {
                return (
                        <td>
                            <span></span>
                        </td>
                    )
            }
        }),
        viewButton: React.createClass({
            render: function(){
                var view = function(group) {
                    this.state.groupService.viewGroupModal(group);
                };

                return (
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-search' onClick={view.bind(this._owner._owner, this.props.group)}></span>
                    </td>
                );
            }
        }),
        editButton: React.createClass({
            render: function(){
                var edit = function(group) {
                    this.state.groupService.editGroupModal(group);
                };

                return (
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-pencil' onClick={edit.bind(this._owner._owner, this.props.group)}></span>
                    </td>
                );
            }
        }),
        deleteButton: React.createClass({
            render: function(){
                var remove = function(group) {
                    this.state.groupService.removeGroupModal(group);
                };

                return ( 
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-remove' onClick={remove.bind(this._owner._owner, this.props.group)}></span>
                    </td>
                );
            }
        }),
        sendButton: React.createClass({
            render: function() {
                var send = function(group) {
                    this.state.groupService.sendGroupModal(group);
                }

                return (
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-comment' onClick={send.bind(this._owner._owner, this.props.group)}></span>
                    </td>
                );
            }
        })
    };

    return groupTable;

});