define("textService",["utilities"],function(a){"use strict";var b={init:function(){this.newTable=document.querySelector("#hgov-main-table"),document.getElementById("send-out-going-text").addEventListener("click",this.sendOutGoingText.bind(this)),document.addEventListener("keydown",a.resetState.bind(this,".hgov-help-block-reply-form")),document.querySelector(".hgov-modal-add-group").addEventListener("click",this.addPhoneNumberToGroup),this.loadAvailableGroups(),a.reactClasses.getTextTable("text-table",this)},loadAvailableGroups:function(){a.ajax({username:a.getCurrentUserName()},"post","/find/availableGroups",function(a){var b,c=document.getElementById("all-groups"),d=document.querySelector(".hgov-modal-add-group");a.groups.length>=1?a.groups.forEach(function(a){d.style.display="",b=document.createElement("option"),b.text=a.groupName,b.value=a.groupId,c.appendChild(b)}):(d.style.display="none",b=document.createElement("option"),b.text="No Groups Available",c.appendChild(b))})},getTexts:function(){},sendOutGoingText:function(){{var b={_id:this.currentText._id};Array.prototype.forEach.call(document.getElementsByName("out-going-text-form")[0].querySelectorAll(".input-sm"),function(a){b[a.name]=a.value})}b.content?a.ajax(b,"post","/send/outgoingText",function(b){a.modalPrompt("textReply","hide"),a.showModal(b)}):document.querySelector(".hgov-help-block-reply-form").style.display="block"},showRespondModal:function(c){a.modalPrompt("textReply","show"),document.getElementsByName("to")[0].value=c.phoneNumber,document.getElementsByName("from")[0].value=a.getCurrentUserName(),document.getElementsByName("content")[0].value="",b.currentText=c},showDeleteModal:function(b){var c={result:"Are you sure you'd like to delete this text?"},d=document.querySelector(".hgov-modal-text-delete");d.style.display="",d.addEventListener("click",a.ajax.bind(this,{id:b._id},"post","/delete/text",function(){window.location.reload()})),a.showModal(c)},showDetailsModal:function(b){var c,d=document.querySelector('form[name="text-details-form"]'),e=document.querySelector('form[name="text-responses"]'),f=this.getResponseDivs(b);Object.keys(b).forEach(function(a){c=d.querySelector('input[name="'+a+'"]'),c&&(c.value=b[a]),"allResponses"===a&&(c.value=b[a].length)}),e.innerHTML="",e.appendChild(f),a.modalPrompt("textDetails","show")},getResponseDivs:function(b){var c=document.createElement("div");return b.allResponses.forEach(function(b){c.appendChild(a.getFormGroup(b.from,b.content,!0))}),c},addToGroup:function(b){document.querySelector(".hgov-group-modal input").value=b.phoneNumber,a.modalPrompt("addPhoneNumberToGroup","show")},addPhoneNumberToGroup:function(){var b={};Array.prototype.forEach.call(document.querySelectorAll('form[name="add-to-group-form"] .add-number'),function(a){b[a.name]=a.value}),a.ajax(b,"post","add/phonenumber/group",function(b){a.showModal(b)})}};return b});