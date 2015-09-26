var url = require('url');
var bodyParser = require('body-parser');
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
		var urlParsed = url.parse(req.url);
		var query = urlParsed.query;
		var body = '';

		req.on('data', function (data) {
			body += data;
		});

		req.on('end', function () {
			var callback = reqCallbacks[method + ':' + urlParsed.pathname];

			if (method === 'POST' || method === 'PUT') {
				if (query && body) {
					req.query = query;
					req.body = body;
				} else if (body) {
					// TODO: Rewrite this logic using body-parser
					req.body = body;
				}
			}

			if (callback) {
				callback.call({}, req, res);
			} else if (reqCallbacks.default) {
				reqCallbacks.default.call({}, req, res);
			} else if (reqCallbacks.notFound) {
				reqCallbacks.notFound.call({}, req, res);
			} else {
				defaultNotFoundCallback.call({}, req, res);
			}
		});
	});

	/**
	 * Default 'Not found' response callback
	 *
	 * @param req {IncomingMessage}
	 * @param res {ServerResponse}
	 */
	function defaultNotFoundCallback(req, res) {
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