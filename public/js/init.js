var login_func = function(dialog, then_join_room){
  var input = $(dialog).find('input').val();
  if(input){
    setNick(input,function(){
        if(then_join_room)
          chooseroom();
      }
    );
    $(dialog).dialog('close');
  }
};

function login_dialog(then_join_room){
  $('#login').dialog({
    title: "Login",
    modal: true,
    closeOnEscape: false,
    buttons: {
      Enter: function(){ login_func(this); }
    },
    open: function(event, ui){
      $(".ui-dialog-titlebar-close").hide();
      var dialog = this;
      $(dialog).keyup(function(e) {
        if (e.keyCode == 13) {
          login_func(dialog, then_join_room);
          e.preventDefault();
        }
      });
    }
  });
}

function open_tut(){
  if($('#tutorial').length)
    $('#tutorial').dialog({ 
      title: "Tutorial", 
      modal: true, 
      buttons:
        {
          Close:function(){
            if($('#never').is(':checked')){
              $.get('/notutorial');
            }
            $(this).dialog('close');
          }
        },
      close: function(){
        login_dialog(true);
      }
    });
  else
    login_dialog(true);
}
open_tut();
