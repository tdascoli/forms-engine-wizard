$(document).ready(function() {
  // knockout view model
  var Page = function(){
    var self = this;

    self.elements = ko.observableArray([]),
                    displayMode = function(element) {
                        return element.getType() + 'Element';
                    };
    self.active = ko.observable(0);

    self.test = new Text('Frage 1');
    self.test.isRequired();
    self.elements.push(self.test);
    self.elements.push(new Text('Frage 2'));

    self.toggleActive = function(id){
        self.active(id);
    };
    self.isActive = function(id){
      console.log(id, self.active());
      if (id===self.active()){
        return 'active';
      }
    };
  };

  var FormsEngineWizard = function() {
    var self = this;

    self.pages = ko.observableArray();
    self.pages.push(new Page());
    self.pages.push(new Page());
  };

  // load templates
  (function() {
      var promises = $("script[type='text/html']").map(function(_, script) {
          if(script.src) {
              var deffered = $.Deferred();
              $.get(script.src, function(tmpl) {
                  script.text = tmpl;
                  if(tmpl.indexOf('type="text/html"') !== -1 || tmpl.indexOf("type='text/html'") !== -1) {
                      $(document.body).append(tmpl);
                  }
                  deffered.resolve();
              })
              return deffered.promise();
          }
      });

      $.when.apply($.when, promises).done(function () {
          ko.applyBindings(new FormsEngineWizard());
      });
  })();
});
