/* 
* @Author: ben_cripps
* @Date:   2015-11-07 13:28:03
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-11-07 13:30:48
*/

define('searchBar', ['react'], function(React){

    return React.createClass({
        getInitialState: function() {
            return {
                searchKeyword: '',
                searchType: 'phoneNumber'
            };
        },
        render: function() {
            var me = this;
            return(
                <div style={{display: 'inline-block;', textAlign: 'left', width: '88%' }}>
                    <me.QueryDropDown />
                    <me.QueryInput />
                    <me.QueryButton keyword={me.state.searchKeyword}/>
                </div>
            );
        },
        QueryButton: React.createClass({
            render: function() {
                return( 
                    <button onClick={this.onClick} className='btn btn-info' style={{float: 'right'}}>Search</button>
                );  
            },
            onClick: function() {

                var ctx = this._owner,
                    parentScope = ctx.props.parentScope,
                    searchQuery = {}
                    query = {city: location.pathname, startIndex: 0};

                ctx.props.utils.setLoading(true, document.querySelector('#exportButtonWrap'));

                if (!ctx.state.searchKeyword) {
                    ctx.props.utils.ajax(query, 'post', '/find/texts', function(data) {
                        
                        parentScope.setState({
                            texts: data.result,
                            total: data.count,
                            tags: data.tags, 
                            currentTag: data.tags[0].id
                        });
                        
                        ctx.props.utils.setLoading(false, document.querySelector('#exportButtonWrap'));
                    });
                }

                else {

                    searchQuery[ctx.state.searchType] = ctx.state.searchKeyword;

                    query.search = searchQuery;
   
                    ctx.props.utils.ajax(query, 'post', '/find/texts', function(data) {
                        
                        parentScope.setState({
                            texts: data.result,
                            total: data.count,
                            tags: data.tags, 
                            currentTag: data.tags[0].id
                        });

                        ctx.props.utils.setLoading(false, document.querySelector('#exportButtonWrap'));
                    });
                }

            }
        }),
        QueryDropDown: React.createClass({
            render: function() {
                return( 
                    <select style={{paddingRight: '10px'}} onChange={this.onChange}>
                        <option value="phoneNumber">Phone Number</option>
                    </select>
                );  
            },
            onChange: function(e) {
                this._owner.setState({searchType: e.target.value });
            }
        }),
        QueryInput: React.createClass({
            render: function() {
                return( 
                    <input onChange={this.onChange} type='text' className='form-control input-sm' style={{marginLeft: '20px', width: '70%', display: 'inline-block'}} />
                );  
            },
            onChange: function(e) {
                this._owner.setState({searchKeyword: e.target.value });
            }
        })
    });

});