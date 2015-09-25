var url = require('url');

var reqCallbacks = {};

/**
 * Router class
 *
 * @class Router
 * @param server {Server} Node.js HTTP server
 * @constructor
 */
var Router = function (server) {
	server.on('request', function (req, res) {
		var method = req.method;
		var path = url.parse(req.url).pathname;
		var body = '';

		req.on('data', function (data) {
			body += data;
		});

		req.on('end', function () {
			var callback = reqCallbacks[method + ':' + path];
			req.body = body ? body : null;

			if (callback) {
				callback.apply({}, [req, res]);
			} else if (reqCallbacks.default) {
				reqCallbacks.default.apply({}, [req, res]);
			} else if (reqCallbacks.notFound) {
				reqCallbacks.notFound.apply({}, [req, res]);
			} else {
				callbackDefault.apply({}, [req, res]);
			}
		});
	});

	/**
	 * Default 'Not found' response callback
	 *
	 * @param req {IncomingMessage}
	 * @param res {ServerResponse}
	 */
	function callbackDefault(req, res) {
		res.writeHead(404, {
			"Content-type": "application/json"
		});
		res.write(JSON.stringify({
			message: 'URL not found!',
			method: req.method,
			url: req.url
		}));
		res.end();
	}
};

Router.prototype = {
	get: function (path, callback) {
		reqCallbacks['GET:' + path] = callback;
	},

	post: function (path, callback) {
		reqCallbacks['POST:' + path] = callback;
	},

	put: function (path, callback) {
		reqCallbacks['PUT:' + path] = callback;
	},

	delete: function (path, callback) {
		reqCallbacks['DELETE:' + path] = callback;
	},

	setDefaultResponse: function (callback) {
		reqCallbacks.default = callback;
	},

	setNotFoundResponse: function (callback) {
		reqCallbacks.notFound = callback;
	}
};

module.exports = function (server) {
	return new Router(server);
};