const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
var isPlayingSong = false;
var queue = [];
var proc;

module.exports.addtoQueue = function(url) {
	queue.push(url);
	console.log(queue, isPlayingSong);
};

module.exports.play = function() {
	console.log(queue, isPlayingSong);
	if (queue.length == 0) { return false; }
	if (isPlayingSong) { return false; }
	let url = queue[0];
	let fileName;

	let stream = ytdl(url, {
		format: 'mp3',
		filter: 'audioonly'
	});

	stream.on('info', (info, format) => {
		isPlayingSong = true;
		fileName = info.videoDetails.title.replace(/[^a-z0-9\-]/gi, '_');
		if (info.videoDetails.media && info.videoDetails.media.artist) { 
			artist = info.videoDetails.media.artist.replace(/[^a-z0-9\-]/gi, '_');
		} else {
			artist = info.videoDetails.author.name.replace(/[^a-z0-9\-]/gi, '_');
		}
		console.log(artist)

		function callback() { 
			console.log("Output done!")
			isPlayingSong = false;
			queue.shift();
			module.exports.play.call();
		}

		proc = ffmpeg()
		  .input(stream)
		  .inputOptions('-re')
		  .noVideo()
		  .output('http://localhost:9090/stream')
		  .outputOptions([
		  	'-content_type', 'audio/mpeg',
		  	'-method', 'PUT',
		  	'-f', 'mp3'
		  	]).on('error', function(err, stdout, stderr) {
		  		console.log('Cannot process video: ' + err.message);
		  		callback();
		  	}).on('end', callback).run();
		console.log("Started streaming "+fileName);
	});

	stream.on('end', () => {
		console.log(fileName)
	});
};

module.exports.getQueue = function() {
	return queue;
};

module.exports.skip = function() {
	if (proc) {
		proc.kill();
	}
	proc = undefined;
	queue.shift();
	module.exports.play.call();
};

module.exports.stop = function() {
	if (proc !== undefined) {
		proc.kill();
		proc = undefined;
		queue = [];
		isPlayingSong = false;
	}
};
