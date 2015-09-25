var path = require('path');
var fs = require('fs');

var server = require('./src/server');
var router = require('./src/router')(server);
var config = require('./src/config');

router.get('/', function (req, res) {
	var indexFileURL = path.join(__dirname, config.publicDir, 'index.html');
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	fs.readFile(indexFileURL, function (err, data) {
		if (err) throw err;
		res.end(data);
	});
});

router.post('/', function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.write('<p>Your request\'s body is:</p>');
	res.write('<pre>');
	res.write(req.body ? req.body : 'Empty');
	res.write('</pre>');
	res.write('<p>And the query is:</p>');
	res.write('<pre>');
	res.write(req.query ? JSON.stringify(req.query) : 'Empty');
	res.write('</pre>');
	res.end('<small>See you!</small>');
});

router.get('/super', function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.write('<p>You did great super today!</p>');
	res.end('<small>See you!</small>');
});
