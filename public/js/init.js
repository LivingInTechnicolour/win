var login_func = function(dialog){
  setNick($(dialog).find('input').val());
  $(dialog).dialog('close');
  open_tut();
};

$('#login').dialog({
  title: "Login",
  modal: true,
  buttons: {
    Enter: function(){ login_func(this); }
  },
  open: function(){ 
    var dialog = this;
    $(dialog).keyup(function(e) {
      if (e.keyCode == 13) {
        login_func(dialog);
        e.preventDefault();
      }
    });
  }
});

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
      }
  });
}
