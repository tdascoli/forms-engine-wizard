(function ($, window, document, undefined) {

  'use strict';

  // todo: implement methods
  function onSuccess(){
    console.log('success');
  }
  function onError(){
    console.log('error');
  }

  function persistFormDefinition(url, data){
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: onSuccess,
        error: onError,
        processData: false,
        type: 'PUT',
        url: url
    });
  }

})(jQuery, window, document);
