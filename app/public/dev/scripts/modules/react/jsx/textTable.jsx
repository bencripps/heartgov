/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:06:18
*/

define('textTable', ['react'], function(React){
    'use strict';
    
    var textTable = {
        init: function(id, utils, service) {
            React.render(<this.table utils={utils} service={service} />, document.getElementById(id));
        },
        table: React.createClass({
            getInitialState: function() {
                return {
                    texts: [],
                    user: this.props.utils.getCurrentUserName(),
                    level: this.props.utils.getCurrentUserLevel(),
                    utils: this.props.utils,
                    textService: this.props.service,
                    rows: {}
                }
            },
            componentWillMount: function(){
                var me = this;
                this.props.utils.ajax(null, 'post', '/find/texts', function(data) { 
                    me.setState({texts: data.result});
                });
            },
            render: function() {
                var me = this,
                    level = this.state.level,
                    insert = this.state.texts.length >= 1 ? this.state.texts.map(function(text){ return [<textTable.row text={text}/>,<textTable.detailsRow level={level} text={text} isHidden={me.state.rows[text._id]} />];}) : <tr><td>No Texts have been recieved</td></tr>;
                
                return (
                    <table className='table table-bordered table-striped' id='main-table'>
                        <tbody>
                            <tr>
                                <th colSpan="10" style={{textAlign:'center'}}>all texts</th>
                            </tr>
                            {insert}
                        </tbody>
                    </table>
                );
            }
        }),
        row: React.createClass({
            render: function() {
                var expand = function(text) {
                        var temp = this.state.rows;
                        temp[text._id] = temp[text._id] !== undefined ? !temp[text._id] : false;
                        this.setState({rows: temp});
                    };

                return (
                    <tr className='hgov-template-td'>
                        <textTable.expandButton text={this.props.text} clickEvent={expand.bind(this._owner, this.props.text)}/>
                        <textTable.dateRow text={this.props.text} />
                        <textTable.contenRow text={this.props.text} />
                    </tr>
                );
            }
        }),
        dateRow: React.createClass({
            render: function() {

                return (<td colSpan="1">
                            <span className='hgov-template-label'>Date Recieved: </span><span>{this.props.text.date}</span>
                        </td>);
            }
        }),
        contenRow: React.createClass({
            render: function() {

                return (<td colSpan="1">
                            <span className='hgov-template-label'>Content: </span><span>{this.props.text.date}</span>
                        </td>);
            }
        }),
        expandButton: React.createClass({
            render: function() {
                return (<td colSpan="1" className='hgov-expand'>
                            <span className='glyphicon glyphicon-plus' onClick={this.props.clickEvent}></span>
                        </td>);
            }
        }),
        detailsRow: React.createClass({
            render: function() {
                var isHidden = this.props.isHidden !== undefined ? this.props.isHidden : true,
                    tdStyle = isHidden ? {display: 'none'} : {display: 'table-row'};

                return(
                    <tr style={tdStyle}>
                        <textTable.utilityDrawer text={this.props.text} level={this.props.level}/>
                        <textTable.details text={this.props.text}/>
                        <textTable.detailsContinued text={this.props.text}/>
                    </tr>
                );
            }
        }),
        utilityDrawer: React.createClass({
            render: function() {
                var showResponse = function(text){
                    this.state.textService.showRespondModal(text);
                };

                var addToGroup = function(text){
                    this.state.textService.addToGroup(text);
                };

                var remove = function(text) {
                    this.state.textService.showDeleteModal(text);
                };

                var showDetails = function(text){
                    this.state.textService.showDetailsModal(text);
                };

                return(
                    <td>
                        <div><span className='glyphicon glyphicon-comment hgov-text-function' onClick={showResponse.bind(this._owner._owner, this.props.text)}></span></div>
                        <div><span className='glyphicon glyphicon-star hgov-text-function' onClick={addToGroup.bind(this._owner._owner, this.props.text)}></span></div>
                        <div> <span className='glyphicon glyphicon-search hgov-text-function' onClick={showDetails.bind(this._owner._owner, this.props.text)}></span></div>
                        {this.props.level !== 'false' ? <div><span className='glyphicon glyphicon-remove hgov-text-function' onClick={remove.bind(this._owner._owner, this.props.text)}></span></div> : null }
                    </td>
                );
            }
        }),
        details: React.createClass({
            render: function() {
                var tdStyle = {textAlign: 'left'};
                return(
                    <td style={tdStyle}>
                        <div><label>Total Responses: </label><span> {this.props.text.allResponses.length}</span></div>
                        <div><label>Category: </label><span></span> {this.props.text.category}</div>
                        <div><label>Last Responder: </label><span></span> {this.props.text.lastResponder}</div>
                        <div><label>Name: </label><span></span> {this.props.text.name}</div>
                    </td>
                );
            }
        }),
        detailsContinued: React.createClass({
            render: function() {
                var tdStyle = {textAlign: 'left'};
                return(
                    <td style={tdStyle}>
                        <div><label>Phone Number: </label><span> {this.props.text.phoneNumber}</span></div>
                        <div><label>Status: </label><span> {this.props.text.status}</span></div>
                        <div><label>Tracking Number: </label><span> {this.props.text.trackingNumber}</span></div>
                        <div><label>Zipcode: </label><span> {this.props.text.zipCode}</span></div>
                    </td>
                );
            }
        })
    };

    return textTable;

});