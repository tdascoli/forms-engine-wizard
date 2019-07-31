var Type = Enum('Type', {
  TEXT      : 'text',
  TEXTAREA  : 'textarea',
  HIDDEN    : 'text',
  EMAIL     : 'email',
  DATE      : 'date',
  DATETIME  : 'datetime-local',
  NUMBER    : 'number',
  CHECKBOX  : 'checkbox',
  RADIO     : 'radio',
  SELECT    : 'select',
  BUTTON    : 'button',
  SUBMIT    : 'submit',
  RESET     : 'reset',
  YESNO     : 'yesNo',
  TYPEAHEAD : 'typeahead',

  TITLE     : 'title',
  PARAGRAPH : 'paragraph',

  CHECKBOX_GROUP  : 'checkboxGroup',
  RADIO_GROUP     : 'radioGroup'
});

var Element = Class({

  'public id': '',
  'public name': '',
  'public label': '',
  'public type': '',
  'public placeholder': '',
  'public helptext': '',
  'public value': '',
  'public required': false,
  'public inputmask': [],
  'public style': [],
  'public attributes': [],
  'public readonly': false,
  'public disabled': false,

  __construct: function(label) {
    this.setId(label);
    this.setName(label);
    this.label = label;
  },

  setId: function(id, isName = false){
    this.id = _.camelCase(id);
    if (isName){
      this.setName(id);
    }
  },

  setName: function(name){
      this.name = _.camelCase(name);
  },

  isRequired: function(){
    this.required = true;
  },

  isDisabled: function(){
    this.disabled = true;
  },

  isReadonly: function(){
    this.readonly = true;
  },

  addStyle: function(style){
    this.style.push(style);
  },

  attr: function(attr, value){
    this.attributes.push({'attr':attr,'value':value});
  }

});

var ElementGroup = Class({

  'public type': '',
  'public elements': [],

  __construct: function(elements) {
    this.elements = elements;
  },

  setId: function(id, isName = false){
    this.id = _.camelCase(id);
    if (isName){
      this.setName(id);
    }
  }

});

var Input = Class({ extends: Element}, {
    __construct: function(label, placeholder = '', helptext = ''){
    this.super('__construct', label);
    if (!_.isEmpty(placeholder)){
        this.placeholder = placeholder;
    }
    if (!_.isEmpty(helptext)){
        this.helptext = helptext;
    }
  }
});

var Text = Class({ extends: Input}, {
    __construct: function(label, placeholder = '', helptext = ''){
    this.super('__construct', label, placeholder, helptext);
    this.type = Type.TEXT;
  }
});

var Checkbox = Class({ extends: Element}, {

    'public checked': false,

    __construct: function(label, value, checked = false){
    this.super('__construct', label);
    this.type = Type.CHECKBOX;
    this.value = value;
    this.checked = checked;
  }
});

var CheckboxGroup = Class({ extends: Element}, {

    'public options': [],

    __construct: function(label, options){
        this.super('__construct', label);
        this.type = Type.CHECKBOX_GROUP;
        this.options = options;
  }
});

var Email = Class({ extends: Input}, {
    __construct: function(label, placeholder = '', helptext = ''){
    this.super('__construct', label, placeholder, helptext);
    this.type = Type.EMAIL;
  }
});

var Hidden = Class({ extends: Input}, {
    __construct: function(id,value = ''){
    this.setId(id, true);
    this.type = Type.HIDDEN;
    if (!_.isEmpty(value)){
        this.value = value;
    }
  }
});

var Number = Class({ extends: Input}, {
    __construct: function(label, placeholder = '', helptext = ''){
    this.super('__construct', label, placeholder, helptext);
    this.type = Type.NUMBER;
  }
});

var Option = Class({

  'public options': [],

  __construct: function() {

  },

  add: function(label, value, selected = false){
    this.options.push(this.create(label, value, selected));
  },

  all: function(){
    return this.options;
  },

  'public static create': function(label, value, selected = false){
    var selectedValue='';
    if (selected){
      selectedValue='selected';
    }
    return {
      value: value,
      label: label,
      selected: selectedValue
    }
  }

});

var Paragraph = Class({ extends: Element}, {

  'public title': '',
  'public description': '',

    __construct: function(title = '', description = ''){
    this.type = Type.PARAGRAPH;
    if (!_.isEmpty(title)){
        this.title = title;
    }
    if (!_.isEmpty(description)){
        this.description = description;
    }
  }
});

var Radio = Class({ extends: Element}, {

    'public checked': false,

    __construct: function(label, value, name, checked = false){
    this.super('__construct', label);
    this.type = Type.RADIO;
    this.value = value;
    this.name = name;
    this.checked = checked;
  }
});

var RadioGroup = Class({ extends: Element}, {

    'public options': [],

    __construct: function(label, options, name = undefined){
        this.super('__construct', label);
        this.type = Type.RADIO_GROUP;
        this.options = options;
        if (name !== undefined){
            this.name = name;
        }
  }
});

var Select = Class({ extends: Element }, {

  'public options': [],
  'public nullable': false,

  __construct: function(label, options, nullable = false, helptext = ''){
    this.super('__construct', label);
    this.type = Type.SELECT;
    this.options = options;
    this.nullable = nullable;
    if (!_.isEmpty(helptext)){
        this.helptext = helptext;
    }
  }

});

var Textarea = Class({ extends: Input}, {
    __construct: function(label, placeholder = '', helptext = ''){
    this.super('__construct', label, placeholder, helptext);
    this.type = Type.TEXTAREA;
  }
});

var Title = Class({ extends: Paragraph}, {
    __construct: function(title, description = ''){
    this.super('__construct', title, description);
    this.type = Type.TITLE;
  }
});

var Typeahead = Class({ extends: Text}, {

    'public options': [],

    __construct: function(label, options, placeholder = '', helptext = ''){
    this.super('__construct', label, placeholder, helptext);
    this.type = Type.TYPEAHEAD;
    this.options = options;
  }
});

var YesNo = Class({ extends: ElementGroup}, {

  'public yesno': [],
  'public name': '',
  'public booleans': false,

  'private yesnoBooleans': { 'Yes': true,'No': false },
  'private yesnoStrings': { 'Yes': 'Ja','No': 'Nein' },

    __construct: function(name, booleans){
    this.type = Type.YESNO;
    this.name = name;
    this.booleans = booleans;
    var values = this.yesnoStrings;
    if (this.booleans){
      values = this.yesnoBooleans;
    }
    this.yesno=new Array(
      new Radio('Ja', values.Yes, this.name),
      new Radio('Nein', values.No, this.name)
    );
  }
});
