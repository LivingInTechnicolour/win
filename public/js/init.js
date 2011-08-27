$('#login').dialog({
  title: "Login",
  modal: true,
  buttons: {
    Enter: function(){
      setNick($('#loginform input').val());
      $(this).dialog('close');
      open_tut();
    }
  }
});

function open_tut(){
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
