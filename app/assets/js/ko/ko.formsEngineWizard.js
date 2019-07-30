/*!
 * forms-engine-wizard
 * FormsEngine Wizard
 * https://github.com/tdascoli/forms-engine-wizard#readme
 * @author tdascoli
 * @version 0.0.1
 * Copyright 2019. MIT licensed.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'knockout', 'Cookies'], function ($, ko) {
            return factory($, ko);
        });
    } else {
        // Browser globals
        factory(root.$, root.ko);
    }
}(this, function ($, ko) {

  ko.extenders.cookie = function(target, options) {
    var cookie_name, persist;
    if (typeof options === 'string') {
      cookie_name = options;
      persist = true;
    } else {
      cookie_name = options.name;
      persist = options.persist;
    }

    target(Cookies.set(cookie_name));


    //Allow external updates on the 'persist' observable to affect the cookie immediately
	//This is useful when you want to set options.persist to
	//	an observable (like a 'remember this setting' checkbox)
	//Checking and unchecking the checkbox will immediately set and clear
	//	the cookie, respectively.
	ko.computed(function () {
		if (!ko.utils.unwrapObservable(options.persist)) {
			Cookies.remove(cookie_name);
		} else {
			Cookies.set(cookie_name, target());
		}
	});

    return ko.computed({
      read: target,
      write: function(value) {
        // If our persist value returns true, then store in a cookie,
        // else remove a cookie with that name if one exists.
        if (ko.utils.unwrapObservable(persist)) {
          Cookies.set(cookie_name, value);
        } else {
          Cookies.remove(cookie_name);
        }

        // If null or undefined was passed to the observable, then
        // unset the associated cookie.
        if (value === null || value === undefined) {
          Cookies.remove(cookie_name);
        }

        target(value);
      }
    });
  }
}));

$(document).ready(function() {
  // data (todo: from formsEngine)
  var types = [
    { type: 'text', name: 'Kurzantwort' },
    { type: 'textarea', name: 'Absatz' },
    { type: 'radio', name: 'Multiple-Choice Frage' },
    { type: 'checkbox', name: 'Kästchen' },
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
    if (type==='title'){
      return 'titleElement';
    }
    else if (type==='paragraph') {
      return 'paragraphElement';
    }
    else if (type==='textarea') {
      return 'textareaElement';
    }
    else if (type==='select') {
      return 'selectElement';
    }
    else if (type==='radio' || type==='checkbox') {
      return 'bulletElement';
    }
    return 'inputElement';
  }

  // knockout view model
  var PageElement = function(element, isActive = ''){
    var self = this;

    self.element = ko.mapping.fromJSON(element.serialize());
    self.type = ko.observable(element.getType());

    self.idValue = function(id, page, element){
        return id+'-'+page+'-'+element;
    };

    self.active = ko.observable(isActive);
    self.activate = function(){
      self.active('active');
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
