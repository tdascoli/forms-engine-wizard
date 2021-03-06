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
  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  };
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
    });

    self.selected = ko.observable(false);
    self.label = self.value();
    self.id = _.camelCase(self.value());
  };

  var PageElement = function(element, uuid = uuidv4()){
    var self = this;

    self.uuid = uuid;
    self.element = ko.mapping.fromJSON(element.serialize());

    self.type = ko.observable(element.getType());
    self.type.subscribe(function (newType) {
      var element = getElement(newType,self.element.name(),self.element.label());
      self.element=ko.mapping.fromJSON(element.serialize());
    });

    self.idValue = function(id, page, element){
        return id+'-'+page+'-'+element;
    };

    self.active = function(isMe){
      if (isMe===self.uuid){
        return 'active';
      }
      return '';
    };

    self.addOption = function(){
      var number = (self.element.options().length)+1;
      self.element.options.push(
        new OptionElement('Option '+number));
    };
    self.removeOption = function(option){
      self.element.options.remove(option);
    };
  };

  var Page = function(root, withTitle = false){
    var self = this;
    var $root = root;

    self.elements = ko.observableArray([]),
                    elementTemplate = function(element) {
                        return getElementTemplate(element.type());
                    };
    if (withTitle){
      self.elements.push(new PageElement(new Paragraph('Unbenannter Abschnitt')));
    }

    self.elements.push(new PageElement(new Text('Frage')));

    self.pageNumber = function(index){
      var pageNumber = index + 1;
      return pageNumber;
    };
    self.addElement = function(){
      var element = new PageElement(new Text('Frage'));
      self.elements.push(element);
      $root.select(element);
    };
    self.remove = function(index){
      self.elements.splice(index,1);
    };
  };

  var Answers = function(name){
    var self = this;

    self.formName=name;
    self.keys = ko.observableArray([]);
    self.answers = ko.observableArray([]);
    self.count = ko.pureComputed(function(){
        return self.answers().length;
    });

    $.getJSON('/api/record/'+self.formName, function(data) {
        self.answers(data);
        self.keys(Object.keys(data[0]));
    });

    self.export = function(type){
      var workbook = new ExcelJS.Workbook();
      var worksheet = workbook.addWorksheet(self.formName);
      // keys
      worksheet.addRow(self.keys())
      // values
      _.forEach(self.answers(), function(row){
        worksheet.addRow(_.values(row));
      });

      switch (type){
        case 'CSV':
              self.asCSV(workbook);
              break;
        default:
              self.asXLSX(workbook);
      };
    };

    self.asCSV = function(workbook){
      var filename = self.formName+'.csv';
      var mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      workbook.csv.writeBuffer()
        .then(function(data) {
          var blob = new Blob([data], { type : mimeType });
          saveAs(blob, filename);
        });
    };

    self.asXLSX = function(workbook){
      var filename = self.formName+'.xlsx';
      var mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      workbook.xlsx.writeBuffer()
        .then(function(data) {
          var blob = new Blob([data], { type : mimeType });
          saveAs(blob, filename);
        });
    };
  };

  var FormsEngineWizard = function() {
    var self = this;

    self.pages = ko.observableArray();
    self.pages.push(new Page(this));
    self.formTitle = new PageElement(new Title('Form Title'));

    self.select = function(element){
      self.isSelected(element.uuid);
    };
    self.isSelected = ko.observable();

    self.canSave =  ko.observable(true);
    self.jsonForm = ko.observable().extend({ cookie: 'jsonForm' });

    self.addPage = function(){
      self.pages.push(new Page(this,true));
    };

    self.types = ko.observableArray();
    // todo jquery or lodash
    $.each(types, function(index, value) {
        self.types.push(value);
    });
    self.typeOf = function(type){
      return _.find(self.types(), { 'type': type });
    };
    self.typeOfFormTitle = 'Form Titel';
    self.subtypes = ko.observableArray();
    // todo jquery or lodash
    $.each(subtypes.input, function(index, value) {
        self.subtypes.push(value);
    });

    self.answers = new Answers('defaultForm');

    self.formDefinition = function(){
      var json={'formTitle':self.formTitle.element, 'pages':new Array()};
      var pageIndex=0;
      _.forEach(self.pages(), function(page) {
        json.pages[pageIndex]=new Array();
        _.forEach(page.elements(), function(pageElement){
          json.pages[pageIndex].push(pageElement.element);
        });
        pageIndex++;
      });
      return ko.toJSON(json);
    };

    self.save = function(){
      // todo name!!
      var name = 'defaultForm';
      var url = '/api/forms/'+name;
      console.log(document.URL,url);
      var json = self.formDefinition();

      // TODO: fetch API
      $.ajax({
          contentType: 'application/json',
          data: json,
          success: function(){
            console.log('success', json);
          },
          error:  function(e){
            console.log('error', e, json);
          },
          processData: false,
          type: 'PUT',
          url: url
      });
    };

    self.generate = function(){
      // todo name!!
      var name = 'defaultForm';
      self.jsonForm(self.formDefinition());
      // open new window
      window.open('form.php?form='+name, '_blank');
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
