/*!
 * forms-engine-wizard
 * FormsEngine Wizard
 * https://github.com/tdascoli/forms-engine-wizard#readme
 * @author tdascoli
 * @version 0.0.1
 * Copyright 2019. MIT licensed.
 */
(function ($, window, document, undefined) {

  'use strict';

  // todo
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
