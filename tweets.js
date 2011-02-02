$("#tweet").focus();
$("#ok").bind("click",function(){
  $.getJSON("/send", {message: $("#tweet").val()}, function(){
    
  });
  setTimeout(function(){ window.location.reload() },2000);
});
