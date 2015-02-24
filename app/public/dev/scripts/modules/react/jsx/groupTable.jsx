/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:06:18
*/

define('groupTable', ['react'], function(React){
    'use strict';
    
    var groupTable = {
        init: function(id, utils) {
            React.render(<this.table utils={utils}/>, document.getElementById(id));
        },
        table: React.createClass({
            getInitialState: function() {
                return {
                    groups: [],
                    user: this.props.utils.getCurrentUserName(),
                    level: this.props.utils.getCurrentUserLevel()
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
                var edit = !eval(this.props.level) ? null : <groupTable.editButton group={this.props.info} />,
                    remove = !eval(this.props.level) ? null : <groupTable.deleteButton group={this.props.info} />,
                    view = !eval(this.props.level) ? null : <groupTable.viewButton group={this.props.info} />;
                return (
                    <tr>
                        {view}
                        {edit}
                        {remove}
                        <td>{this.props.info.groupName}</td>
                    </tr>
                );
            }
        }),
        viewButton: React.createClass({
            render: function(){
                var view = function(group) {
                    console.log(group);
                };

                return (
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-search' onClick={view.bind(this, this.props.group)}></span>
                    </td>
                );
            }
        }),
        editButton: React.createClass({
            render: function(){
                var edit = function(group) {
                    console.log(group);
                };

                return (
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-pencil' onClick={edit.bind(this, this.props.group)}></span>
                    </td>
                );
            }
        }),
        deleteButton: React.createClass({
            render: function(){
                var remove = function(group) {
                    console.log(group);
                };

                return ( 
                    <td className='group-button hgov-text-function'>
                        <span className='glyphicon glyphicon-remove' onClick={remove.bind(this, this.props.group)}></span>
                    </td>
                );
            }
        })
    };

    return groupTable;

});