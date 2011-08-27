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
      keys: ['up', 'down', 'left', 'right'],
      events: ['keydown', 'keyup'],
      fun: function(){
        console.log('will delegat to game to take care of these');
        return false;
      },
    }
  ]
};

var key, n, e, k, this_key;
for (key in keys.input){
  $('#input').bind('keydown', key, keys.input[key]);
}
for (key in keys['document']){
  for (n=0; n < keys['document'].length; n++){
    this_key = keys['document'][n];
    for (e=0; e < this_key.events.length; e++){
      for (k=0; k < this_key.keys.length; k++){
        $(document).bind(this_key.events[e], this_key.keys[k], this_key.fun);
      }
    }
  }
}
