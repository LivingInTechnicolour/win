require('nko')('+ME1r0iK74WTHJja');
var express = require('express')
  , stylus = require('stylus')
  , nowjs = require('now');

var app = express.createServer();

var everyone = nowjs.initialize(app, {'socketio': {transports:['htmlfile', 'xhr-polling', 'jsonp-polling']}});

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

everyone.now.distributeMessage = function(msg){
  everyone.now.receiveMessage(this.now.name, msg);
}
