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
    $('#history').stop().animate({ scrollTop: $('#history > .inner').outerHeight() }, "fast");
  }
  $('#history > .inner').append('<p><span class="sender">'+u.esc(name)+'</span>: <span class="message">'+u.esc(message)+'</span></p>');
};

function setNick(name, success){
  now.authenticate(name, success, function(){
      //when it fails, do nothing.. whatever
    }
  );
}

$(function(){
  now.ready(function() {
      setNick('guest_'+Math.floor(Math.random()*10001), function(){
        now.joinRoom('home');
      });
  });
});

$('#chatform').submit(function(e){

  var input = document.getElementById('input');
  var msg = input.value;

  //parse special commands
  if (msg.substr(0,1) == '/') {
    if (msg.substr(1,5) == 'nick ') {
      setNick(msg.substr(6));
    } else if (msg.substr(1,2) == 'j ') {
      now.joinRoom(msg.substr(3));
    }
  } else {
   now.distributeMessage(msg);
  }
  $('#input').focus();
  input.value = '';
  e.preventDefault();
});

var game = new GameCanvas({'width': 1000, 'height': 500, 'canvasId': 'app'});
game.gameLoop();
