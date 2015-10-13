!/* 
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
                    startIndex: 0,
                    total: 0,
                    tags: [],
                    currentTag: '',
                    rows: {}
                }
            },
            componentWillMount: function(){
                var me = this;
                this.props.utils.ajax({city: location.pathname, startIndex: 0}, 'post', '/find/texts', function(data) { 
                    me.setState({
                        texts: data.result,
                        total: data.count,
                        tags: data.tags, 
                        currentTag: data.tags[0].id
                    })
                });
            },
            render: function() {
                var me = this,
                    level = this.state.level,
                    insert = this.state.texts.length >= 1 ? this.state.texts.map(function(text){ return [React.createElement(textTable.row, {text: text}),React.createElement(textTable.detailsRow, {level: level, text: text, isHidden: me.state.rows[text._id]})];}) : React.createElement("tr", null, React.createElement("td", null, "No Texts have been recieved"));

                return (
                    React.createElement("table", {className: "table table-bordered table-striped", id: "main-table", style: {position: 'relative'}}, 
                        React.createElement("tbody", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", {colSpan: "10", style: {textAlign:'center'}}, 
                                    "all texts", 
                                    React.createElement(textTable.exportButton, {currentTag: this.state.currentTag, level: this.state.level})
                                )
                            ), 
                            React.createElement(textTable.searchBar, {tags: this.state.tags}), 
                            insert, 
                             React.createElement(textTable.pagination, {texts: this.state.texts, total: this.state.total, startIndex: this.state.startIndex})
                            
                        )
                    )
                );
            }
        }),
        exportButton: React.createClass({displayName: "exportButton",
            render: function() {
                var button = this.props.level ? React.createElement("div", {id: "exportButtonWrap"}, React.createElement("button", {onClick: this.onClick, class: "btn", style: {float: 'right'}, id: "exportButton"}, "Export Results")) : null;
                return(
                    button
                );
            },
            onClick: function(e) {
                var ctx = this._owner;

                ctx.state.utils.setLoading(true, document.querySelector('#exportButtonWrap'));

                ctx.state.utils.ajax({tag: ctx.state.currentTag, city: location.pathname}, 'post', '/export/texts', function(response) { 
                    ctx.state.utils.setLoading(false, document.querySelector('#exportButtonWrap'));
                    var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(response, null, '\t'));
                    window.open(url, '_blank');
                    window.focus();
                });
            }
        }),
        pagination: React.createClass({displayName: "pagination",
            render: function() {
                var start = this.props.startIndex * 10,
                    increment = start + this.props.texts.length;

                return (
                    React.createElement("tr", null, 
                        React.createElement("td", {colSpan: "10"}, 
                            React.createElement("span", {style: {float: 'left', marginLeft: '2px'}}, 
                                "Page",  
                            React.createElement("input", {type: "text", style: {width: '20px', marginRight: '20px', marginLeft: '6px'}, value: this.props.startIndex, onChange: this.onChange})
                            ), 
                            React.createElement("span", {style: {float: 'left', marginLeft: '2px'}}, 
                                "Viewing ", start, " through ", increment, " of ", this.props.total
                            ), 
                            React.createElement("span", {style: {float: 'right', marginRight: '2px'}}, 
                                React.createElement(textTable.nextButton, {isDisabled: increment === this.props.total})
                            ), 
                            React.createElement("span", {style: {float: 'right', marginRight: '20px'}}, 
                                React.createElement(textTable.lastButton, {isDisabled: start === 0})
                            )
                        )
                    )
                    );
            },

            onChange: function(e) {

                var ctx = this._owner,
                    currentTagId = ctx.state.currentTag;

                ctx.setState({startIndex: e.target.value});

                ctx.state.utils.setLoading(true, document.querySelector('#main-table'));

                ctx.state.utils.ajax({city: location.pathname, startIndex: e.target.value, tagId: currentTagId}, 'post', '/find/texts', function(data) { 
                    ctx.setState({texts: data.result});
                    ctx.setState({total: data.count});
                    ctx.state.utils.setLoading(false, document.querySelector('#main-table'));
                });
            }
        }),

        searchBar: React.createClass({displayName: "searchBar",

            render: function() {
                return(
                    React.createElement("tr", null, 
                        React.createElement("th", {colSpan: "10"}, 
                            React.createElement(textTable.tagDropDown, {tags: this.props.tags})
                        )
                    )
                );
            }
        }),

        tagDropDown: React.createClass({displayName: "tagDropDown",
            render: function() {
                var tags = this.props.tags.map(function(tag){ return React.createElement("option", {value: tag.id}, tag.name); });

                return(

                    React.createElement("select", {onChange: this.onChange}, 
                        tags
                    )
                );
            },

            onChange: function(e) {
     
                var ctx = this._owner._owner,
                    tagId = e.target.value;

                ctx.state.utils.setLoading(true, document.querySelector('#main-table'));

                ctx.state.utils.ajax({city: location.pathname, startIndex: 0, tagId: tagId}, 'post', '/find/texts', function(data) { 
                    ctx.setState({texts: data.result});
                    ctx.setState({total: data.count});
                    ctx.setState({startIndex: 0});
                    ctx.setState({currentTag: tagId});
                    ctx.state.utils.setLoading(false, document.querySelector('#main-table'));
                });
            }
        }),

        nextButton: React.createClass({displayName: "nextButton",
            render: function() {
                return(
                    React.createElement("button", {class: "btn", onClick: this.doClick, disabled: this.props.isDisabled}, "Next Page")
                    );
            },

            doClick: function() {
                var ctx = this._owner._owner,
                    currentIndex = ctx.state.startIndex,
                    currentTagId = ctx.state.currentTag;

                ctx.state.utils.setLoading(true, document.querySelector('#main-table'));

                ctx.state.utils.ajax({city: location.pathname, startIndex: parseInt(currentIndex) + 1, tagId: currentTagId}, 'post', '/find/texts', function(data) { 
                    ctx.setState({texts: data.result});
                    ctx.setState({total: data.count});
                    ctx.setState({startIndex: parseInt(currentIndex) + 1});
                    ctx.state.utils.setLoading(false, document.querySelector('#main-table'));
                });

            }
        }),
        lastButton: React.createClass({displayName: "lastButton",
            render: function() {
   
                return(
                    React.createElement("button", {class: "btn", onClick: this.doClick, disabled: this.props.isDisabled}, "Last Page")
                    );
            },

            doClick: function() {
                var ctx = this._owner._owner,
                    currentIndex = ctx.state.startIndex,
                    currentTagId = ctx.state.currentTag;

                ctx.state.utils.setLoading(true, document.querySelector('#main-table'));

                ctx.state.utils.ajax({city: location.pathname, startIndex: parseInt(currentIndex) - 1, tagId: currentTagId}, 'post', '/find/texts', function(data) { 
                    ctx.setState({texts: data.result});
                    ctx.setState({total: data.count});
                    ctx.setState({startIndex: parseInt(currentIndex) - 1});
                    ctx.state.utils.setLoading(false, document.querySelector('#main-table'));
                });

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