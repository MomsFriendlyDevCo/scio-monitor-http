var request = require('superagent');

module.exports = {
	_scio: true,
	_name: 'HTTP',
	monitors: [
		{
			ref: 'http',
			description: 'Test a HTTP(s) response',
			type: 'enum',
			options: [
				{
					id: 'method',
					type: 'enum',
					choices: ['GET', 'POST', 'HEAD', 'DELETE', 'PUT'],
					default: 'GET',
				},
				{
					id: 'timeout',
					type: 'timeout',
					default: 30 * 1000,
				},
				{
					id: 'headers',
					type: 'object',
					description: 'HTTP headers that should be sent along with the request',
				},
				{
					id: 'query',
					type: 'object',
					description: 'GET query parameters',
				},
				{
					id: 'body',
					type: 'object',
					description: 'POST query parameters',
				},
			],
			callback: function(next, service) {
				var req;

				if (service.options.method == 'GET') {
					req = request.get(service.address || service.server.address);
				} else if (service.options.method == 'POST') {
					req = request.post(service.address || service.server.address);
				} else if (service.options.method == 'HEAD') {
					req = request.head(service.address || service.server.address);
				} else if (service.options.method == 'DELETE') {
					req = request.delete(service.address || service.server.address);
				} else if (service.options.method == 'PUT') {
					req = request.put(service.address || service.server.address);
				}

				if (service.options.headers) req.set(service.options.headers);

				if (service.options.query) req.query(service.options.query);

				if (service.options.body) req.send(service.options.body);

				if (service.options.timeout) req.timeout(service.options.timeout);

				req.end(function(err, res) {
					if (err) return next(err);
					if (res.statusCode != 200) return next("Non OK status code: " + res.statusCode + ' - ' + res.text);
					if (res.body.err) return next(res.body.err);

					next(null, 'ok');
				});
			},
		},
	],
};
