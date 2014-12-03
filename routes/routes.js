module.exports = function( app, env, fs, url, path ) {

	var format = require('../config/format')(path),
		index = ['/scripts/main.js'];

    app.get('/', function(req, res) {

    	res.render('index', { 
    		title : 'Index HTML', 
    		local: path,
    		scripts: format.call(index)
    	});

    });

   
};