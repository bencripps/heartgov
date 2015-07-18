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
            React.render(React.createElement(this.table, {utils: utils, service: service}), document.getElementById(id));
        },
        table: React.createClass({displayName: "table",
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
                this.props.utils.ajax({assignedCities: location.pathname}, 'post', '/find/texts', function(data) { 
                    me.setState({texts: data.result});
                });
            },
            render: function() {
                var me = this,
                    level = this.state.level,
                    insert = this.state.texts.length >= 1 ? this.state.texts.map(function(text){ return [React.createElement(textTable.row, {text: text}),React.createElement(textTable.detailsRow, {level: level, text: text, isHidden: me.state.rows[text._id]})];}) : React.createElement("tr", null, React.createElement("td", null, "No Texts have been recieved"));
                
                return (
                    React.createElement("table", {className: "table table-bordered table-striped", id: "main-table"}, 
                        React.createElement("tbody", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", {colSpan: "10", style: {textAlign:'center'}}, "all texts")
                            ), 
                            insert
                        )
                    )
                );
            }
        }),
        row: React.createClass({displayName: "row",
            render: function() {
                var expand = function(text) {
                        var temp = this.state.rows;
                        temp[text._id] = temp[text._id] !== undefined ? !temp[text._id] : false;
                        this.setState({rows: temp});
                    };

                return (
                    React.createElement("tr", {className: "hgov-template-td"}, 
                        React.createElement(textTable.expandButton, {text: this.props.text, clickEvent: expand.bind(this._owner, this.props.text)}), 
                        React.createElement(textTable.dateRow, {text: this.props.text}), 
                        React.createElement(textTable.contenRow, {text: this.props.text})
                    )
                );
            }
        }),
        dateRow: React.createClass({displayName: "dateRow",
            render: function() {

                return (React.createElement("td", {colSpan: "1"}, 
                            React.createElement("span", {className: "hgov-template-label"}, "Date Recieved: "), React.createElement("span", null, this.props.text.date)
                        ));
            }
        }),
        contenRow: React.createClass({displayName: "contenRow",
            render: function() {

                return (React.createElement("td", {colSpan: "1"}, 
                            React.createElement("span", {className: "hgov-template-label"}, "Content: "), React.createElement("span", null, this.props.text.date)
                        ));
            }
        }),
        expandButton: React.createClass({displayName: "expandButton",
            render: function() {
                return (React.createElement("td", {colSpan: "1", className: "hgov-expand"}, 
                            React.createElement("span", {className: "glyphicon glyphicon-plus", onClick: this.props.clickEvent})
                        ));
            }
        }),
        detailsRow: React.createClass({displayName: "detailsRow",
            render: function() {
                var isHidden = this.props.isHidden !== undefined ? this.props.isHidden : true,
                    tdStyle = isHidden ? {display: 'none'} : {display: 'table-row'};

                return(
                    React.createElement("tr", {style: tdStyle}, 
                        React.createElement(textTable.utilityDrawer, {text: this.props.text, level: this.props.level}), 
                        React.createElement(textTable.details, {text: this.props.text}), 
                        React.createElement(textTable.detailsContinued, {text: this.props.text})
                    )
                );
            }
        }),
        utilityDrawer: React.createClass({displayName: "utilityDrawer",
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
                    React.createElement("td", null, 
                        React.createElement("div", null, React.createElement("span", {className: "glyphicon glyphicon-comment hgov-text-function", onClick: showResponse.bind(this._owner._owner, this.props.text)})), 
                        React.createElement("div", null, React.createElement("span", {className: "glyphicon glyphicon-star hgov-text-function", onClick: addToGroup.bind(this._owner._owner, this.props.text)})), 
                        React.createElement("div", null, " ", React.createElement("span", {className: "glyphicon glyphicon-search hgov-text-function", onClick: showDetails.bind(this._owner._owner, this.props.text)})), 
                        this.props.level !== 'false' ? React.createElement("div", null, React.createElement("span", {className: "glyphicon glyphicon-remove hgov-text-function", onClick: remove.bind(this._owner._owner, this.props.text)})) : null
                    )
                );
            }
        }),
        details: React.createClass({displayName: "details",
            render: function() {
                var tdStyle = {textAlign: 'left'};
                return(
                    React.createElement("td", {style: tdStyle}, 
                        React.createElement("div", null, React.createElement("label", null, "Total Responses: "), React.createElement("span", null, " ", this.props.text.allResponses.length)), 
                        React.createElement("div", null, React.createElement("label", null, "Category: "), React.createElement("span", null), " ", this.props.text.category), 
                        React.createElement("div", null, React.createElement("label", null, "Last Responder: "), React.createElement("span", null), " ", this.props.text.lastResponder), 
                        React.createElement("div", null, React.createElement("label", null, "Name: "), React.createElement("span", null), " ", this.props.text.name)
                    )
                );
            }
        }),
        detailsContinued: React.createClass({displayName: "detailsContinued",
            render: function() {
                var tdStyle = {textAlign: 'left'};
                return(
                    React.createElement("td", {style: tdStyle}, 
                        React.createElement("div", null, React.createElement("label", null, "Phone Number: "), React.createElement("span", null, " ", this.props.text.phoneNumber)), 
                        React.createElement("div", null, React.createElement("label", null, "Status: "), React.createElement("span", null, " ", this.props.text.status)), 
                        React.createElement("div", null, React.createElement("label", null, "Tracking Number: "), React.createElement("span", null, " ", this.props.text.trackingNumber)), 
                        React.createElement("div", null, React.createElement("label", null, "Zipcode: "), React.createElement("span", null, " ", this.props.text.zipCode))
                    )
                );
            }
        })
    };

    return textTable;

});