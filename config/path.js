var getPath = function( env ) {
	
	if ( env === 'dev' ) return 'dev';

	return 'min';
};

module.exports = getPath;