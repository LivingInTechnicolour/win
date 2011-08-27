// for some reason events in the input and in the document are
// separate... don't know why, but I want to keep that behavior :)

var keys = {
  input: {
    tab: function(){
      $('#input').blur();
      return false;
    }
  },
  'document' : [{
      keys: ['tab'],
      events: ['keydown'],
      fun: function(){
        $('#input').focus();
        return false;
      },
    }, {
      keys: ['j'],
      events: ['keydown'],
      fun: function(){
        $('#chooseroom').dialog({
          modal:true,
          buttons:{
            Join:function(){
              var room = $(this).find('input[name="room"]:checked').val();
              now.joinRoom(room);
              $(this).dialog('close');
            }, Cancel: function(){
              $(this).dialog('close');
            }
          }
        });
      }
    }, {
      keys: ['n'],
      events: ['keydown'],
      fun: function(){
        var nick = prompt('Choose a nickname!');
        if(nick){
          setNick(nick);
        }
      }
    }
  ]
};

var key, n, e, k, this_key;
for (key in keys.input){
  $('#input').bind('keydown', key, keys.input[key]);
}
for (n=0; n < keys['document'].length; n++){
  this_key = keys['document'][n];
  for (e=0; e < this_key.events.length; e++){
    for (k=0; k < this_key.keys.length; k++){
      //TODO: a better check
      if(this_key.events[e] && this_key.keys[k] && this_key.fun){
        $(document).bind(this_key.events[e], this_key.keys[k], this_key.fun);
      }
    }
  }
}
