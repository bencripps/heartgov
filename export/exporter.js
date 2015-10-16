/* 
* @Author: ben_cripps
* @Date:   2015-08-25 21:20:55
* @Last Modified by:   ben_cripps
* @Last Modified time: 2015-10-16 10:14:17
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
            textSchema.find({'tag.id': query.tag}).sort({'textInformation.date': 1}).exec().then(function(resp) {
                server.setHeader('Content-Type', 'application/json');
                server.send(JSON.stringify(exporter.utils.getJSON(resp)));
            });
        },
        utils: {
            getJSON: function(arr) {
                var ret = [],
                    numbers = arr.map(function(ob) { return ob.userInformation.phoneNumber.string; }).getUnique(),
                    userTexts = [],
                    textObj,
                    zipCode;



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

                // var responses = arr.map(function(ob){ return ob.textInformation.body; }),
                //     zips = responses.filter(function(val){ return Number(val) && val.replace(/\s/g, '').length === 5; }),
                //     formattedZips = zips.map(function(z) { return z.replace(/\s/g, ''); }),
                //     retForAsher = {};


                // formattedZips.forEach(function(num) { 

                //   if (!retForAsher[num]) {
                //     retForAsher[num] = 1;
                //   }

                //   else {
                //     retForAsher[num]+= 1;
                //   }

                // });
              
                // return retForAsher;

                // var retObj = {};

                // numbers.forEach(function(num) {

                //     userTexts = arr.filter(function(ob) { return ob.userInformation.phoneNumber.string === num; });

                //     userTexts.forEach(function(text, i) {

                //       if(!retObj[i + 1]) {
                //         retObj[i+1] = [text.textInformation.body];
                //       }

                //       else {
                //         retObj[i+1].push(text.textInformation.body);
                //       }

                //     });

                // });

                // return retObj;

            }
        }
    };

    return exporter;
};
