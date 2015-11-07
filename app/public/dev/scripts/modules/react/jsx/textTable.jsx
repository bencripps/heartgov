!/* 
* @Author: Ben
* @Date:   2015-01-14 10:05:07
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-02-21 11:06:18
*/

define('textTable', ['react', 'searchBar'], function(React, SearchBar){
    'use strict';

    console.log(SearchBar);
    
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
                    insert = this.state.texts.length >= 1 ? this.state.texts.map(function(text){ return [<textTable.row text={text}/>,<textTable.detailsRow level={level} text={text} isHidden={me.state.rows[text._id]} />];}) : <tr><td>No Texts have been recieved</td></tr>;

                return (
                    <table className='table table-bordered table-striped' id='main-table' style={{position: 'relative'}}>
                        <tbody>
                            <tr>
                                <th colSpan="10" style={{textAlign:'center'}}>
                                    <SearchBar parentScope={me} utils={me.state.utils}/>
                                    <textTable.exportButton currentTag={this.state.currentTag} level={this.state.level}/>
                                </th>
                            </tr>
                            <textTable.searchBar tags={this.state.tags} />
                            {insert}
                             <textTable.pagination texts={this.state.texts} total={this.state.total} startIndex={this.state.startIndex}/>
                            
                        </tbody>
                    </table>
                );
            }
        }),
        exportButton: React.createClass({
            render: function() {
                var button = this.props.level ? <div id='exportButtonWrap' style={{display: 'inline-block', float: 'right'}}><button onClick={this.onClick} className='btn btn-success' id='exportButton'>Export Results</button></div> : null;
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
        pagination: React.createClass({
            render: function() {
                var start = this.props.startIndex * 10,
                    increment = start + this.props.texts.length;

                return (
                    <tr>
                        <td colSpan='10'>
                            <span style={{float: 'left', marginLeft: '2px'}}>
                                Page 
                            <input type='text' style={{width: '20px', marginRight: '20px', marginLeft: '6px'}} value={this.props.startIndex} onChange={this.onChange} />
                            </span>
                            <span style={{float: 'left', marginLeft: '2px'}}>
                                Viewing {start} through {increment} of {this.props.total}
                            </span>
                            <span style={{float: 'right', marginRight: '2px'}}>
                                <textTable.nextButton isDisabled={increment === this.props.total}/>
                            </span>
                            <span style={{float: 'right', marginRight: '20px'}}>
                                <textTable.lastButton isDisabled={start === 0}/>
                            </span>
                        </td>
                    </tr>
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

        searchBar: React.createClass({

            render: function() {
                return(
                    <tr>
                        <th colSpan="10">
                            <textTable.tagDropDown tags={this.props.tags} />
                        </th>
                    </tr>
                );
            }
        }),

        tagDropDown: React.createClass({
            render: function() {
                var tags = this.props.tags.map(function(tag){ return <option value={tag.id}>{tag.name}</option>; });

                return(

                    <select onChange={this.onChange}>
                        {tags}
                    </select>
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

        nextButton: React.createClass({
            render: function() {
                return(
                    <button class="btn" onClick={this.doClick} disabled={this.props.isDisabled}>Next Page</button>
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
        lastButton: React.createClass({
            render: function() {
   
                return(
                    <button class="btn" onClick={this.doClick} disabled={this.props.isDisabled}>Last Page</button>
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

                return (<td colSpan="1" style={{width: '300px'}}>
                            <span className='hgov-template-label'>Date Recieved: </span><span>{this.props.text.date}</span>
                        </td>);
            }
        }),
        contenRow: React.createClass({
            render: function() {

                return (<td colSpan="1"  style={{textAlign: 'left'}}>
                            <span className='hgov-template-label'>Content: </span><span>{this.props.text.content}</span>
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