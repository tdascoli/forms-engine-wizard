$(document).ready(function() {
  // data (todo: from formsEngine?)
  var types = [
    { type: 'text', name: 'Kurzantwort' },
    { type: 'textarea', name: 'Lange Antwort' },
    { type: 'radioGroup', name: 'Multiple-Choice Frage' },
    { type: 'checkboxGroup', name: 'Kästchen' },
    { type: 'select', name: 'Dropdown' },
    { type: 'paragraph', name: 'Text' }
  ];
  var subtypes = {
    input: [
      { type: 'text', name: 'Text' },
      { type: 'number', name: 'Zahl' },
      { type: 'email', name: 'E-Mail' }
    ]
  };
  // utils
  function getElementTemplate(type){
    switch(type){
      case 'title':
        return 'titleElement';
        break;
      case 'paragraph':
        return 'paragraphElement';
        break;
      case 'textarea':
        return 'textareaElement';
        break;
      case 'select':
        return 'selectElement';
        break;
      case 'radioGroup':
      case 'checkboxGroup':
        return 'bulletElement';
        break;
      default:
        return 'inputElement';
    }
  };
  function getElement(type, name, label){
    switch(type){
      case 'paragraph':
        return new Paragraph(label);
        break;
      case 'textarea':
        return new Textarea(label);
        break;
      case 'select':
        return new Select(label,Array());
        break;
      case 'radioGroup':
        return new RadioGroup(label,Array(),name);
        break;
      case 'checkboxGroup':
        return new CheckboxGroup(label,Array());
        break;
      case 'number':
        return new Number(label);
        break;
      case 'email':
        return new Email(label);
        break;
      default:
        return new Text(label);
    }
  };
  // knockout view model
  var OptionElement = function(option){
    var self = this;

    self.value = ko.observable(option);
    self.value.subscribe(function (newValue) {
      self.label = newValue;
      self.id = _.camelCase(newValue);
      console.log('newValue',self.id, self.label);
    });

    self.selected = ko.observable(false);
    self.label = self.value;
    self.id = _.camelCase(self.value);
  };

  var PageElement = function(element, isActive = ''){
    var self = this;

    self.element = ko.mapping.fromJSON(element.serialize());

    self.type = ko.observable(element.getType());
    self.type.subscribe(function (newType) {
      var element = getElement(newType,self.element.name(),self.element.label());
      self.element=ko.mapping.fromJSON(element.serialize());
    });

    self.idValue = function(id, page, element){
        return id+'-'+page+'-'+element;
    };

    self.active = ko.observable(isActive);
    self.activate = function(){
      self.active('active');
    };

    self.addOption = function(){
      self.element.options.push(
        new OptionElement('Option '+self.element.options.length));
    };
    self.removeOption = function(option){
      self.element.options.remove(option);
    };
  };

  var Page = function(withTitle = false){
    var self = this;

    self.elements = ko.observableArray([]),
                    elementTemplate = function(element) {
                        return getElementTemplate(element.type());
                    };
    if (withTitle){
      self.elements.push(new PageElement(new Paragraph('Unbenannter Abschnitt')));
    }

    var question = new Text('Frage');
    self.elements.push(new PageElement(question));

    self.pageNumber = function(index){
      var pageNumber = index + 1;
      return pageNumber;
    };
    self.add = function(element,active){
      self.elements.push(new PageElement(element,active));
    };
    self.addElement = function(){
      var element = new Text('Frage');
      self.add(element,'active');
    };
    self.remove = function(index){
      self.elements.splice(index,1);
    };
  };

  var FormsEngineWizard = function() {
    var self = this;

    self.pages = ko.observableArray();
    self.pages.push(new Page());
    self.formTitle = new PageElement(new Title('Form Title'));

    self.canSave =  ko.observable(false);
    self.jsonForm = ko.observable().extend({ cookie: 'jsonForm' });

    self.addPage = function(){
      self.pages.push(new Page(true));
    };
    self.addElement = function(page){
      var page = _.last(self.pages());
      var element = new Text('Frage');
      page.add(element,'active');
    };

    self.types = ko.observableArray();
    $.each(types, function(index, value) {
        self.types.push(value);
    });
    self.typeOf = function(type){
      return _.find(self.types(), { 'type': type });
    };
    self.typeOfFormTitle = 'Form Titel';
    self.subtypes = ko.observableArray();
    $.each(subtypes.input, function(index, value) {
        self.subtypes.push(value);
    });

    self.generate = function(){
      var json={'formTitle':self.formTitle.element, 'pages':new Array()};
      var pageIndex=0;
      _.forEach(self.pages(), function(page) {
        json.pages[pageIndex]=new Array();
        _.forEach(page.elements(), function(pageElement){
          json.pages[pageIndex].push(pageElement.element);
        });
        pageIndex++;
      });
      self.jsonForm(ko.toJSON(json));
      // open new window
      window.open('form.php', '_blank');
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
