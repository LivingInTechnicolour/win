require('nko')('+ME1r0iK74WTHJja');
var express = require('express')
  , stylus = require('stylus')
  , nowjs = require('now');

var app = express.createServer();

var everyone = nowjs.initialize(app, {
  'socketio': {
    transports:['htmlfile', 'xhr-polling', 'jsonp-polling']
  },
  "clientWrite" : true//can we set this to false and still have a way
  //for the server to run something on the client???
  //we just don't want the client to be messing with their state variables
  //i guess we should store them outside the now object
});

app.configure(function(){
  app.set('view engine', 'jade');

  app.use(stylus.middleware(
    { src: __dirname + '/stylus',
      dest: __dirname + '/public'}
  ));
  app.use(express.static(__dirname + '/public'));

});

app.configure('development', function(){
  app.use(express.logger());
});

app.get('/', function(req, res) {
  res.render('index');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

require(__dirname + '/now/everything.js')(everyone);
