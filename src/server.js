var http = require('http');
var config = require('./config');

var server = http.createServer().listen(config.port, config.host, require('./listen'));

module.exports = server;