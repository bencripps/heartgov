/* 
* @Author: ben_cripps
* @Date:   2014-12-01 10:10:44
* @Last Modified by:   ben_cripps
* @Last Modified time: 2014-12-03 18:21:34
*/

var express = require('express'),
    bodyParser = require('body-parser'),
    env = process.argv.length === 3 && process.argv[2] === 'dev' ? process.argv[2] : 'prod',
    fs = require('fs'),
    url = require('url'),
    path = require('./config/path'),
    app = express();
    
app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');

app.use(express.static('app/public'));

app.use( bodyParser() );

require('./routes/routes.js')( app, env, fs, url, path(env) );

app.listen(app.get('port'), function() {

  console.log('This app is running in ' + env + ' mode, on port ' + app.get('port') );
  
});

