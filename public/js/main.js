now.receiveMessage = function(name, message){
  $('#history').append('<br>'+name+': '+message);
};

now.name = 'guest_'+Math.floor(Math.random()*10001);

$('#chatform').submit(function(){
  var input = document.getElementById('input');
  var msg = input.value;
  if(msg.substr(0,1) == '/'){
    if(msg.substr(1,5) == 'nick '){
      now.name = msg.substr(6);
      input.value = '';
      return false;
    }
  }

  now.distributeMessage(msg);
  input.value = '';
  return false;
});
