!define("textTable",["react","searchBar"],function(a,b){"use strict";console.log(b);var c={init:function(b,c,d){a.render(a.createElement(this.table,{utils:c,service:d}),document.getElementById(b))},table:a.createClass({displayName:"table",getInitialState:function(){return{texts:[],user:this.props.utils.getCurrentUserName(),level:this.props.utils.getCurrentUserLevel(),utils:this.props.utils,textService:this.props.service,startIndex:0,total:0,tags:[],currentTag:"",rows:{}}},componentWillMount:function(){var a=this;this.props.utils.ajax({city:location.pathname,startIndex:0},"post","/find/texts",function(b){a.setState({texts:b.result,total:b.count,tags:b.tags,currentTag:b.tags[0].id})})},render:function(){var d=this,e=this.state.level,f=this.state.texts.length>=1?this.state.texts.map(function(b){return[a.createElement(c.row,{text:b}),a.createElement(c.detailsRow,{level:e,text:b,isHidden:d.state.rows[b._id]})]}):a.createElement("tr",null,a.createElement("td",null,"No Texts have been recieved"));return a.createElement("table",{className:"table table-bordered table-striped",id:"main-table",style:{position:"relative"}},a.createElement("tbody",null,a.createElement("tr",null,a.createElement("th",{colSpan:"10",style:{textAlign:"center"}},a.createElement(b,{parentScope:d,utils:d.state.utils}),a.createElement(c.exportButton,{currentTag:this.state.currentTag,level:this.state.level}))),a.createElement(c.searchBar,{tags:this.state.tags}),f,a.createElement(c.pagination,{texts:this.state.texts,total:this.state.total,startIndex:this.state.startIndex})))}}),exportButton:a.createClass({displayName:"exportButton",render:function(){var b=this.props.level?a.createElement("div",{id:"exportButtonWrap",style:{display:"inline-block","float":"right"}},a.createElement("button",{onClick:this.onClick,className:"btn btn-success",id:"exportButton"},"Export Results")):null;return b},onClick:function(a){var b=this._owner;b.state.utils.setLoading(!0,document.querySelector("#exportButtonWrap")),b.state.utils.ajax({tag:b.state.currentTag,city:location.pathname},"post","/export/texts",function(a){b.state.utils.setLoading(!1,document.querySelector("#exportButtonWrap"));var c="data:text/json;charset=utf8,"+encodeURIComponent(JSON.stringify(a,null,"	"));window.open(c,"_blank"),window.focus()})}}),pagination:a.createClass({displayName:"pagination",render:function(){var b=10*this.props.startIndex,d=b+this.props.texts.length;return a.createElement("tr",null,a.createElement("td",{colSpan:"10"},a.createElement("span",{style:{"float":"left",marginLeft:"2px"}},"Page",a.createElement("input",{type:"text",style:{width:"20px",marginRight:"20px",marginLeft:"6px"},value:this.props.startIndex,onChange:this.onChange})),a.createElement("span",{style:{"float":"left",marginLeft:"2px"}},"Viewing ",b," through ",d," of ",this.props.total),a.createElement("span",{style:{"float":"right",marginRight:"2px"}},a.createElement(c.nextButton,{isDisabled:d===this.props.total})),a.createElement("span",{style:{"float":"right",marginRight:"20px"}},a.createElement(c.lastButton,{isDisabled:0===b}))))},onChange:function(a){var b=this._owner,c=b.state.currentTag;b.setState({startIndex:a.target.value}),b.state.utils.setLoading(!0,document.querySelector("#main-table")),b.state.utils.ajax({city:location.pathname,startIndex:a.target.value,tagId:c},"post","/find/texts",function(a){b.setState({texts:a.result}),b.setState({total:a.count}),b.state.utils.setLoading(!1,document.querySelector("#main-table"))})}}),searchBar:a.createClass({displayName:"searchBar",render:function(){return a.createElement("tr",null,a.createElement("th",{colSpan:"10"},a.createElement(c.tagDropDown,{tags:this.props.tags})))}}),tagDropDown:a.createClass({displayName:"tagDropDown",render:function(){var b=this.props.tags.map(function(b){return a.createElement("option",{value:b.id},b.name)});return a.createElement("select",{onChange:this.onChange},b)},onChange:function(a){var b=this._owner._owner,c=a.target.value;b.state.utils.setLoading(!0,document.querySelector("#main-table")),b.state.utils.ajax({city:location.pathname,startIndex:0,tagId:c},"post","/find/texts",function(a){b.setState({texts:a.result}),b.setState({total:a.count}),b.setState({startIndex:0}),b.setState({currentTag:c}),b.state.utils.setLoading(!1,document.querySelector("#main-table"))})}}),nextButton:a.createClass({displayName:"nextButton",render:function(){return a.createElement("button",{"class":"btn",onClick:this.doClick,disabled:this.props.isDisabled},"Next Page")},doClick:function(){var a=this._owner._owner,b=a.state.startIndex,c=a.state.currentTag;a.state.utils.setLoading(!0,document.querySelector("#main-table")),a.state.utils.ajax({city:location.pathname,startIndex:parseInt(b)+1,tagId:c},"post","/find/texts",function(c){a.setState({texts:c.result}),a.setState({total:c.count}),a.setState({startIndex:parseInt(b)+1}),a.state.utils.setLoading(!1,document.querySelector("#main-table"))})}}),lastButton:a.createClass({displayName:"lastButton",render:function(){return a.createElement("button",{"class":"btn",onClick:this.doClick,disabled:this.props.isDisabled},"Last Page")},doClick:function(){var a=this._owner._owner,b=a.state.startIndex,c=a.state.currentTag;a.state.utils.setLoading(!0,document.querySelector("#main-table")),a.state.utils.ajax({city:location.pathname,startIndex:parseInt(b)-1,tagId:c},"post","/find/texts",function(c){a.setState({texts:c.result}),a.setState({total:c.count}),a.setState({startIndex:parseInt(b)-1}),a.state.utils.setLoading(!1,document.querySelector("#main-table"))})}}),row:a.createClass({displayName:"row",render:function(){var b=function(a){var b=this.state.rows;b[a._id]=void 0!==b[a._id]?!b[a._id]:!1,this.setState({rows:b})};return a.createElement("tr",{className:"hgov-template-td"},a.createElement(c.expandButton,{text:this.props.text,clickEvent:b.bind(this._owner,this.props.text)}),a.createElement(c.dateRow,{text:this.props.text}),a.createElement(c.contenRow,{text:this.props.text}))}}),dateRow:a.createClass({displayName:"dateRow",render:function(){return a.createElement("td",{colSpan:"1",style:{width:"300px"}},a.createElement("span",{className:"hgov-template-label"},"Date Recieved: "),a.createElement("span",null,this.props.text.date))}}),contenRow:a.createClass({displayName:"contenRow",render:function(){return a.createElement("td",{colSpan:"1",style:{textAlign:"left"}},a.createElement("span",{className:"hgov-template-label"},"Content: "),a.createElement("span",null,this.props.text.content))}}),expandButton:a.createClass({displayName:"expandButton",render:function(){return a.createElement("td",{colSpan:"1",className:"hgov-expand"},a.createElement("span",{className:"glyphicon glyphicon-plus",onClick:this.props.clickEvent}))}}),detailsRow:a.createClass({displayName:"detailsRow",render:function(){var b=void 0!==this.props.isHidden?this.props.isHidden:!0,d=b?{display:"none"}:{display:"table-row"};return a.createElement("tr",{style:d},a.createElement(c.utilityDrawer,{text:this.props.text,level:this.props.level}),a.createElement(c.details,{text:this.props.text}),a.createElement(c.detailsContinued,{text:this.props.text}))}}),utilityDrawer:a.createClass({displayName:"utilityDrawer",render:function(){var b=function(a){this.state.textService.showRespondModal(a)},c=function(a){this.state.textService.addToGroup(a)},d=function(a){this.state.textService.showDeleteModal(a)},e=function(a){this.state.textService.showDetailsModal(a)};return a.createElement("td",null,a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-comment hgov-text-function",onClick:b.bind(this._owner._owner,this.props.text)})),a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-star hgov-text-function",onClick:c.bind(this._owner._owner,this.props.text)})),a.createElement("div",null," ",a.createElement("span",{className:"glyphicon glyphicon-search hgov-text-function",onClick:e.bind(this._owner._owner,this.props.text)})),"false"!==this.props.level?a.createElement("div",null,a.createElement("span",{className:"glyphicon glyphicon-remove hgov-text-function",onClick:d.bind(this._owner._owner,this.props.text)})):null)}}),details:a.createClass({displayName:"details",render:function(){var b={textAlign:"left"};return a.createElement("td",{style:b},a.createElement("div",null,a.createElement("label",null,"Total Responses: "),a.createElement("span",null," ",this.props.text.allResponses.length)),a.createElement("div",null,a.createElement("label",null,"Category: "),a.createElement("span",null)," ",this.props.text.category),a.createElement("div",null,a.createElement("label",null,"Last Responder: "),a.createElement("span",null)," ",this.props.text.lastResponder),a.createElement("div",null,a.createElement("label",null,"Name: "),a.createElement("span",null)," ",this.props.text.name))}}),detailsContinued:a.createClass({displayName:"detailsContinued",render:function(){var b={textAlign:"left"};return a.createElement("td",{style:b},a.createElement("div",null,a.createElement("label",null,"Phone Number: "),a.createElement("span",null," ",this.props.text.phoneNumber)),a.createElement("div",null,a.createElement("label",null,"Status: "),a.createElement("span",null," ",this.props.text.status)),a.createElement("div",null,a.createElement("label",null,"Tracking Number: "),a.createElement("span",null," ",this.props.text.trackingNumber)),a.createElement("div",null,a.createElement("label",null,"Zipcode: "),a.createElement("span",null," ",this.props.text.zipCode)))}})};return c});