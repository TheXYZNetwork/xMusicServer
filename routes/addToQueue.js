const fs = require('fs');
const ytdl = require('ytdl-core');
const config = require('../config/config.js');
const mS = require('../mediaStreamer.js');

module.exports = function(app, config) {
	app.post('/add-to-queue', function(req, res, next) {
		if (!req.body.key || req.body.key !== config.secret) { return res.status(403).json({ error: "Invalid Secret Key", result: null }); }
		var urlToDownload = req.body.url;
		if (ytdl.validateURL(urlToDownload) == false) {
			return res.json({ error: "Invalid URL", result: null});
		}
		mS.addtoQueue(urlToDownload);
		res.json({ error: null, result: "Added to queue"});
	});
};