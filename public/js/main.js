//utils
u = {};
//utils.escapeHtml
u.esc = function(t){
  return $('<div/>').text(t).html();
};

function has_scrollbar(elem) { 
  if (elem[0].clientHeight < elem[0].scrollHeight) 
    return true; 
  else
    return false;
} 
     
game = new GameCanvas({'width': 1000, 'height': 500, 'canvasId': 'app'});

now.receiveMessage = function(name, message){
  var elem = $('#history');
  var inner = $('#history > .inner');
  var had_scrollbar = has_scrollbar(elem);//to detect the first reaching of the end of the box
  if ( elem.scrollTop() + elem.height() == inner.outerHeight() ) {
    $('#history').stop().animate({ scrollTop: $('#history > .inner').outerHeight() }, "fast");
  }
  inner.append('<p><span class="sender">'+u.esc(name)+'</span>: <span class="message">'+u.esc(message)+'</span></p>');
  //we have to scroll it if it just got a scroll bar
  if (!had_scrollbar && has_scrollbar(elem)){
     $('#history').stop().animate({ scrollTop: $('#history > .inner').outerHeight() }, "fast");
  }
};

now.receiveStateUpdate = function(name, state) {
    console.log("Name: " + name);
    console.log(state);
    game.state[name] = state;
};

now.receiveState = function(room, char_name, state) {
    console.log("Receiving room state...");
    console.log(state);
    game.setRoomState(room, char_name, state);
};

function setNick(name, success){
  now.authenticate(name, success, function(){
      //when it fails, do nothing.. whatever
    }
  );
}

$(function(){
  now.ready(function() {
      game.gameLoop(now.updateState);
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



