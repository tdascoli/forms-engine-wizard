// FormsEngine Pagination
$( document ).ready(function() {
  var sections = $('.forms-engine__page');

  // config
  $('.forms-engine__form').parsley({
    errorClass: 'is-invalid',
    successClass: 'is-valid',
    errorsWrapper: '<span class="invalid-feedback">',
    errorTemplate: '<span></span>',
    classHandler: function(ParsleyField) {
        return ParsleyField.$element.parents('.form-control');
    },
    errorsContainer: function(ParsleyField) {
        return ParsleyField.$element.parents('.form-control');
    }
  });
  // end config

  function navigateTo(index) {
    // Mark the current section with the class 'current'
    $(sections)
      .removeClass('current')
      .eq(index)
        .addClass('current');

    $(sections)
      .hide()
      .eq(index)
        .show();

    $('#back').toggle(index > 0);
    var atTheEnd = index >= $(sections).length - 1;
    $('#next').toggle(!atTheEnd);
    $('#submit').toggle(atTheEnd);
  }

  function curIndex() {
    return $(sections).index($(sections).filter('.current'));
  }

  $('#next').click(function(){
    $('.forms-engine__form').parsley().whenValidate({
      group: 'block-' + curIndex()
    }).done(function() {
      navigateTo(curIndex() + 1);
    });
  });

  $('#back').click(function(){
    navigateTo(curIndex() - 1);
  });

  $(sections).each(function(index, section) {
    $(section).find(':input').attr('data-parsley-group', 'block-' + index);
  });
  navigateTo(0);
});

$( document ).ready(function() {
  (function ($) {
    $.fn.formJSON = function () {
        var o = {};
        var a = this.find(':input');
        $.each(a, function () {
          if (this.type !== 'button' &&
              this.type !== 'submit' &&
              this.type !== 'reset'){
            if (!o[this.name]) {
              if (this.type!=='radio' &&
                  this.type!=='checkbox'){
                  o[this.name] = this.value || '';
              }
              else {
                if ($(this).is(":checked")){
                  o[this.name] = this.value;
                }
                else {
                  o[this.name] = '';
                }
              }
            }
          }
        });
        return o;
    };
  })(jQuery);


  if ($('.forms-engine__form').length > 0 &&
      $('.forms-engine__form').attr('method')!=='post'){
    $('.forms-engine__message').hide();
    $('.forms-engine__exception').hide();

    $('.forms-engine__form').submit(function(event) {
      $('.forms-engine__exception').hide();

      event.preventDefault();
      var data = $(this).formJSON();
      var url = $(this).attr('action');

      $.ajax({
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: onSuccess,
          error: onError,
          processData: false,
          type: 'PUT',
          url: url
      });
    });
  }

  function onSuccess(){
    $('.forms-engine__form').hide();
    $('.forms-engine__message').show();
    $('.forms-engine__message').toggleClass('d-none');
  }

  function onError(){
    $('.forms-engine__exception').show();
    $('.forms-engine__exception').toggleClass('d-none');
  }

});
