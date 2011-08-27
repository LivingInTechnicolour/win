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
