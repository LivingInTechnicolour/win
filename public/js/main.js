//utils
u = {};
//utils.escapeHtml
u.esc = function(t){
  return $('<div/>').text(t).html();
};

now.receiveMessage = function(name, message){
  var elem = $('#history');
  var inner = $('#history > .inner');
  if ( Math.abs(inner.offset().top) + elem.height() + elem.offset().top >= inner.outerHeight() ) {
    $('#history').animate({ scrollTop: $('#history > .inner').outerHeight() }, "fast");
  }
  $('#history > .inner').append('<p><span class="sender">'+u.esc(name)+'</span>: <span class="message">'+u.esc(message)+'</span></p>');
};

$(function(){
  now.ready(function() {
    now.authenticate('guest_'+Math.floor(Math.random()*10001));
    now.joinRoom('home');
  });
});

$('#chatform').submit(function(){

  var input = document.getElementById('input');
  var msg = input.value;

  //parse special commands
  if (msg.substr(0,1) == '/') {
    if (msg.substr(1,5) == 'nick ') {
      now.name = msg.substr(6);
      input.value = '';
      return false;
    } else if (msg.substr(1,2) == 'j ') {
      now.joinRoom(msg.substr(3));
      input.value = '';
      return false;
    }
  }

  now.distributeMessage(msg);
  input.value = '';
  return false;
});

var game = new GameCanvas({'width': 1000, 'height': 500, 'canvasId': 'app'});
game.gameLoop();
