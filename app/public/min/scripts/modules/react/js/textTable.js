define("textTable",["react"],function(a){"use strict";var b={init:function(b,c,d){a.render(a.createElement(this.table,{utils:c,service:d}),document.getElementById(b))},table:a.createClass({displayName:"table",getInitialState:function(){return{texts:[],user:this.props.utils.getCurrentUserName(),level:this.props.utils.getCurrentUserLevel(),utils:this.props.utils,textService:this.props.service,startIndex:0,total:0,tags:[],currentTag:"",rows:{}}},componentWillMount:function(){var a=this;this.props.utils.ajax({city:location.pathname,startIndex:0},"post","/find/texts",function(b){a.setState({texts:b.result}),a.setState({total:b.count}),a.setState({tags:b.tags}),a.setState({currentTag:b.tags[0].id})})},render:function(){var c=this,d=this.state.level,e=this.state.texts.length>=1?this.state.texts.map(function(e){return[a.createElement(b.row,{text:e}),a.createElement(b.detailsRow,{level:d,text:e,isHidden:c.state.rows[e._id]})]}):a.createElement("tr",null,a.createElement("td",null,"No Texts have been recieved"));return a.createElement("table",{className:"table table-bordered table-striped",id:"main-table"},a.createElement("tbody",null,a.createElement("tr",null,a.createElement("th",{colSpan:"10",style:{textAlign:"center"}},"all texts")),a.createElement(b.searchBar,{tags:this.state.tags}),e,a.createElement(b.pagination,{texts:this.state.texts,total:this.state.total,startIndex:this.state.startIndex})))}}),pagination:a.createClass({displayName:"pagination",render:function(){var c=10*this.props.startIndex,d=c+this.props.texts.length;return a.createElement("tr",null,a.createElement("td",{colSpan:"10"},a.createElement("span",{style:{"float":"left",marginLeft:"2px"}},"Viewing ",c," through ",d," of ",this.props.total),a.createElement("span",{style:{"float":"right",marginRight:"2px"}},a.createElement(b.nextButton,{isDisabled:d===this.props.total})),a.createElement("span",{style:{"float":"right",marginRight:"20px"}},a.createElement(b.lastButton,{isDisabled:0===c}))))}}),searchBar:a.createClass({displayName:"searchBar",render:function(){return a.createElement("tr",null,a.createElement("th",{colSpan:"10"},a.createElement(b.tagDropDown,{tags:this.props.tags})))}}),tagDropDown:a.createClass({displayName:"tagDropDown",render:function(){var b=this.props.tags.map(function(b){return a.createElement("option",{value:b.id},b.name)});return a.createElement("select",{onChange:this.onChange},b)},onChange:function(a){var b=this._owner._owner,c=b.state.startIndex,d=a.target.value;b.state.utils.ajax({city:location.pathname,startIndex:c,tagId:d},"post","/find/texts",function(a){b.setState({texts:a.result}),b.setState({total:a.count}),b.setState({startIndex:c})})}}),nextButton:a.createClass({displayName:"nextButton",render:function(){return a.createElement("button",{"class":"btn",onClick:this.doClick,disabled:this.props.isDisabled},"Next Page")},doClick:function(){var a=this._owner._owner,b=a.state.startIndex,c=a.state.currentTag;a.state.utils.ajax({city:location.pathname,startIndex:b+1,tagId:c},"post","/find/texts",function(c){a.setState({texts:c.result}),a.setState({total:c.count}),a.setState({startIndex:b+1})})}}),lastButton:a.createClass({displayName:"lastButton",render:function(){return a.createElement("button",{"class":"btn",onClick:this.doClick,disabled:this.props.isDisabled},"Last Page")},doClick:function(){var a=this._owner._owner,b=a.state.startIndex;a.state.utils.ajax({city:location.pathname,startIndex:b-1},"post","/find/texts",function(c){a.setState({texts:c.result}),a.setState({total:c.count}),a.setState({startIndex:b-1})})}}),row:a.createClass({displayName:"row",render:function(){var c=function(a){var b=this.state.rows;b[a._id]=void 0!==b[a._id]?!b[a._id]:!1,this.setState({rows:b})};return a.createElement("tr",{className:"hgov-template-td"},a.createElement(b.expandButton,{text:this.props.text,clickEvent:c.bind(this._owner,this.props.text)}),a.createElement(b.dateRow,{text:this.props.text}),a.createElement(b.contenRow,{text:this.props.text}))}}),dateRow:a.createClass({displayName:"dateRow",render:function(){return a.createElement("td",{colSpan:"1"},a.createElement("span",{className:"hgov-template-label"},"Date Recieved: "),a.createElement("span",null,this.props.text.date))}}),contenRow:a.createClass({displayName:"contenRow",render:function(){return a.createElement("td",{colSpan:"1"},a.createElement("span",{className:"hgov-template-label"},"Content: "),a.createElement("span",null,this.props.text.date))}}),expandButton:a.createClass({displayName:"expandButton",render:function(){return a.createElement("td",{colSpan:"1",className:"hgov-expand"},a.createElement("span",{className:"glyphicon glyphicon-plus",onClick:this.props.clickEvent}))}}),detailsRow:a.createClass({displayName:"detailsRow",render:function(){var c=void 0!==this.props.isHidden?this.props.isHidden:!0,d=c?{display:"none"}:{display:"table-row"};return a.createElement("tr",{style:d},a.createElement(b.utilityDrawer,{text:this.props.text,level:this.props.level}),a.createElement(b.details,{text:this.props.text}),a.createElement(b.detailsContinued,{text:this.props.text}))}}),utilityDrawer:a.createClass({displayName:"utilityDrawer",render:function(){var b=function(a){this.state.textService.showRespondModal(a)},c=function(a){this.state.textService.addToGroup(a)},d=function(a){this.state.textService.showDeleteModal(a)},e=function(a){this.state.textService.showDetailsModal(a)};return a.createElement("td",null,a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-comment hgov-text-function",onClick:b.bind(this._owner._owner,this.props.text)})),a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-star hgov-text-function",onClick:c.bind(this._owner._owner,this.props.text)})),a.createElement("div",null," ",a.createElement("span",{className:"glyphicon glyphicon-search hgov-text-function",onClick:e.bind(this._owner._owner,this.props.text)})),"false"!==this.props.level?a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-remove hgov-text-function",onClick:d.bind(this._owner._owner,this.props.text)})):null)}}),details:a.createClass({displayName:"details",render:function(){var b={textAlign:"left"};return a.createElement("td",{style:b},a.createElement("div",null,a.createElement("label",null,"Total Responses: "),a.createElement("span",null," ",this.props.text.allResponses.length)),a.createElement("div",null,a.createElement("label",null,"Category: "),a.createElement("span",null)," ",this.props.text.category),a.createElement("div",null,a.createElement("label",null,"Last Responder: "),a.createElement("span",null)," ",this.props.text.lastResponder),a.createElement("div",null,a.createElement("label",null,"Name: "),a.createElement("span",null)," ",this.props.text.name))}}),detailsContinued:a.createClass({displayName:"detailsContinued",render:function(){var b={textAlign:"left"};return a.createElement("td",{style:b},a.createElement("div",null,a.createElement("label",null,"Phone Number: "),a.createElement("span",null," ",this.props.text.phoneNumber)),a.createElement("div",null,a.createElement("label",null,"Status: "),a.createElement("span",null," ",this.props.text.status)),a.createElement("div",null,a.createElement("label",null,"Tracking Number: "),a.createElement("span",null," ",this.props.text.trackingNumber)),a.createElement("div",null,a.createElement("label",null,"Zipcode: "),a.createElement("span",null," ",this.props.text.zipCode)))}})};return b});