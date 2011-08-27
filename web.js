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
  
  app.use(express.cookieParser());
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
  var data = { show_tut: req.cookies.hide_tut !== 'yes' };
  res.render('index', data);
});

app.get('/notutorial', function(req, res){
  res.cookie('hide_tut', 'yes', {maxAge: 3*365*24*60*60*1000}); //3 years?
  res.send('ok');
});

app.get('/yestutorial', function(req, res){
  res.cookie('hide_tut', 'no', {maxAge: Date()}); //kill it
  res.send('ok');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

var nowstuff = require(__dirname + '/now/everything.js');
nowstuff.setup(everyone);
