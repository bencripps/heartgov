/* 
* @Author: ben_cripps
* @Date:   2015-11-07 13:28:03
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-07 13:30:48
*/

define('searchBar', ['react'], function(React){

    var searchBar = React.createClass({displayName: "searchBar",
        getInitialState: function() {
            return {
                searchKeyword: '',
                searchType: 'phoneNumber'
            };
        },
        render: function() {
            var me = this;
            return(
                React.createElement("div", {style: {display: 'inline-block;', textAlign: 'left', width: '88%'}}, 
                    React.createElement(me.QueryDropDown, null), 
                    React.createElement(me.QueryInput, null), 
                    React.createElement(me.QueryButton, {keyword: me.state.searchKeyword})
                )
            );
        },
        QueryButton: React.createClass({displayName: "QueryButton",
            render: function() {
                return( 
                    React.createElement("button", {onClick: this._owner.executeSearch.bind(this, this), className: "btn btn-info", style: {float: 'right'}}, "Search")
                );  
            }
        }),
        QueryDropDown: React.createClass({displayName: "QueryDropDown",
            render: function() {
                return( 
                    React.createElement("select", {style: {paddingRight: '10px'}, onChange: this.onChange}, 
                        React.createElement("option", {value: "phoneNumber"}, "Phone Number")
                    )
                );  
            },
            onChange: function(e) {
                this._owner.setState({searchType: e.target.value });
                this._owner.props.parentScope.setState({searchType: e.target.value });
            }
        }),
        QueryInput: React.createClass({displayName: "QueryInput",
            render: function() {
                return( 
                    React.createElement("input", {onKeyDown: this.onKeyDown, onChange: this.onChange, type: "text", className: "form-control input-sm", style: {marginLeft: '20px', width: '70%', display: 'inline-block'}})
                );  
            },
            onChange: function(e) {
                this._owner.setState({searchKeyword: e.target.value });
                this._owner.props.parentScope.setState({searchKeyword: e.target.value });
            },
            onKeyDown: function(e) {
                if (e.which === 13) {
                    this._owner.executeSearch(this);
                }
            }
        }),
        executeSearch: function(scope) {
            var parentScope = this._owner,
                searchQuery = {}
                query = {city: location.pathname, startIndex: 0};

            parentScope.props.utils.setLoading(true, document.querySelector('#exportButtonWrap'));

            if (!this.state.searchKeyword) {
                parentScope.props.utils.ajax(query, 'post', '/find/texts', function(data) {
                    
                    parentScope.setState({
                        texts: data.result,
                        total: data.count,
                        tags: data.tags, 
                        currentTag: data.tags[0].id
                    });

                    parentScope.props.utils.setLoading(false, document.querySelector('#exportButtonWrap'));
                });
            }

            else {

                searchQuery[this.state.searchType] = this.state.searchKeyword;

                query.search = searchQuery;

                parentScope.props.utils.ajax(query, 'post', '/find/texts', function(data) {
                    
                    parentScope.setState({
                        texts: data.result,
                        total: data.count,
                        tags: data.tags, 
                        currentTag: data.tags[0].id
                    });

                    parentScope.props.utils.setLoading(false, document.querySelector('#exportButtonWrap'));
                });
            }

        }
    });

    return searchBar;

});