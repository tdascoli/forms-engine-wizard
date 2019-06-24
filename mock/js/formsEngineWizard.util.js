// FormsEngine Wizard util
$( document ).ready(function() {
  var elements = $('.element');
  // todo -> better solution
  $('.element').click(function(){
    $(elements).removeClass('active');
    $(this).addClass('active');
  });
});
