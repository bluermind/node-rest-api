var path = require('path');
var fs = require('fs');

var server = require('./src/server');
var router = require('./src/router')(server);
var config = require('./src/config');

router.get('/', function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.write(fs.readFileSync(path.join(__dirname, config.publicDir, 'index.html')));
	res.end();
});

router.post('/', function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.write('<h1>Great post!</h1>');
	res.write('<h2>Your request\'s body:</h2>');
	res.write('<pre>');
	res.write(req.body ? req.body : 'clean');
	res.write('</pre>');
	res.end();
});

router.get('/super', function (req, res) {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	res.write('<p>You did great super today!</p>');
	res.end();
});
