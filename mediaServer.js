const Stream = require('stream')
var stream;
var listeners = [];

module.exports = function(app) {
  app.keepAliveTimeout = 30 * 1000;
  app.get('/stream', function(req, res, next) {
    res.set({
        "Content-Type": "audio/mpeg",
        "Transfer-Encoding": "chunked"
    });

    listeners.push(res);
    
  });

  app.put('/stream', function(req, res, next) {
    console.log("Starting PUT Stream")
    req.on('data', function (chunk) {
      if (listeners.length > 0){
          for (listener in listeners){
              listeners[listener].write(chunk);
          };
      }
    })
    req.on('end', function(){
      console.log('aaaaa')
    });   
  });
};