$('#chatform').submit(function(){
  var input = document.getElementById('input');
  console.log(input.value);
  input.value = '';
  return false;
});
