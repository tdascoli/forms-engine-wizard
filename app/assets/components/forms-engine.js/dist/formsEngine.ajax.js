// ajax.completeHandler.js
function formJSON(form) {
    var allowedInputElements = ['input','textarea','select'];
    var o = {};
    for (var i = 0; i < form.length; i++) {
      var element = form[i];
      if (element.name &&
          allowedInputElements.includes(element.tagName.toLowerCase())){
        if (!o[element.name]) {
          if (element.type!=='radio' &&
              element.type!=='checkbox'){
              o[element.name] = element.value || '';
          }
          else {
            o[element.name] = (element.checked) ? element.value : '';
          }
        }
      }
    };
    return o;
};


function onSuccess(){
  $('.forms-engine__form').hide();
  $('.forms-engine__message').show();
  $('.forms-engine__message').toggleClass('d-none');
}

function onError(){
  $('.forms-engine__exception').show();
  $('.forms-engine__exception').toggleClass('d-none');
}

var submit = function(event){
  event.preventDefault();
  var data = formJSON(this.elements);
  var url = this.getAttribute('action');

  fetch(url, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    // do stuff with the data
    console.log(data);
  });
  /*
  .then(response => response.ok)
  .then(data => console.log('data:',data))
  .catch(error => console.log('error is', error));
  */
};

var testsubmit = function(){
  var data = formJSON(form.elements);
  var url = form.getAttribute('action');

  console.log(url, data);
};

const form = document.getElementsByClassName('forms-engine__form').item(0);

form.onsubmit = submit;
