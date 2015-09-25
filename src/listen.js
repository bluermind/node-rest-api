var config = require('./config');

module.exports = function () {
	console.log('Server is listening on port ' + config.port);
};
