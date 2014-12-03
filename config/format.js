module.exports = function(env) {
	return function(env) { return this.map( function(s) { return env + s; }) };
}