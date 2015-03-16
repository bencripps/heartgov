module.exports = function(env) {
	return function() { return this.map( function(s) { return env + s; }); };
};