const fs = require('fs');
const ytdl = require('ytdl-core');
const config = require('../config/config.js');
const mS = require('../mediaStreamer.js');

module.exports = function(app, config) {
	app.post('/stop', function(req, res, next) {
		if (!req.body.key || req.body.key !== config.secret) { return res.status(403).json({ error: "Invalid Secret Key", result: null }); }
		mS.stop();
		res.json({ error: null, result: "Stopped" });
	});
};