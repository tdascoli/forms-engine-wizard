$(document).ready(function() {
  // knockout view model
  var PageElement = function(element){
    var self = this;

    self.element = ko.mapping.fromJSON(element.serialize());

    self.idValue = function(id, page, element){
        return id+'-'+page+'-'+element;
    };
  };
  var Page = function(){
    var self = this;
    self.elements = ko.observableArray([]),
                    displayMode = function(element) {
                        return element.element.type() + 'Element';
                    };
    self.active = ko.observable(0);

    var element = new Text('Frage 1');
    element.isRequired();
    var test = new PageElement(element);
    self.elements.push(test);

    // todo toggle not correctly working
    self.toggleActive = function(id){
        self.active(id);
    };
    self.isActive = function(id){
      console.log(id, self.active());
      if (id===self.active()){
        return 'active';
      }
    };

    self.add = function(element){
      self.elements.push(new PageElement(element));
    };

    self.remove = function(index){
      self.elements.splice(index,1);
    };
  };

  var FormsEngineWizard = function() {
    var self = this;

    self.pages = ko.observableArray();
    self.pages.push(new Page());

    // todo add "correct" element
    self.addElement = function(){
      var page = _.last(self.pages());
      var element = new Text('Frage X');
      page.add(element);
    };
  };

  // load templates and apply knockout bindings
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
