define("loginService",["utilities"],function(a){"use strict";var b={init:function(){var b=document.getElementById("main-login")||document.getElementById("main-logout"),c=document.getElementById("all-image-src"),d=document.getElementById("main-login")?this.attemptLogin.bind(this,{}):this.logout.bind(this);a.fixpolygon(),b&&b.addEventListener("click",d),c&&a.preloadImages()},attemptLogin:function(b,c){c.preventDefault(),Array.prototype.forEach.call(document.querySelectorAll(".hgov-login-container input"),function(a){b[a.name]=a.value}),a.ajax(b,"post","/login",function(b){a.showModal(b),document.cookie="key "+b.key,b.code>0&&setTimeout(a.redirect.bind(this,"/database"),1e3)})},logout:function(){a.ajax(!1,"post","/logout",function(){a.redirect("/")})}};return b});