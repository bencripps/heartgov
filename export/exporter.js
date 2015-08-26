/* 
* @Author: ben_cripps
* @Date:   2015-08-25 21:20:55
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-08-25 21:42:28
*/

var TextObject = require('./textClass');

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
};

module.exports = function(textSchema, appMessages) {
    
    var exporter = {
        export: function(query, server) {
            textSchema.find({'tag.id': query.tag}).exec().then(function(resp) {
                server.setHeader('Content-Type', 'application/json');
                server.send(JSON.stringify(exporter.utils.getJSON(resp)));
            });
        },
        utils: {
            getJSON: function(arr) {
                var ret = [];
                var numbers = arr.map(function(ob) { return ob.userInformation.phoneNumber.string; }).getUnique();
                var userTexts = [];
                var textObj;
                var zipCode;

                numbers.forEach(function(num) {

                    userTexts = arr.filter(function(ob) { return ob.userInformation.phoneNumber.string === num; });
                    zipCode = userTexts[0].textInformation.location.fromZip;

                    textObj = new TextObject(num, zipCode);

                    userTexts.forEach(function(text, i) {
                        textObj.addResponse(text.textInformation.body, i + 1);
                    });

                    ret.push(textObj.values);
                });

                return ret;
            }
        }
    };

    return exporter;
};
