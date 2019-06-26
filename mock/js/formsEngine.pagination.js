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
