/***************************************************************************************
 *	kScriptor javascript library
 ******* ---------------------------------------------------------------------- *******
 *		Copyright 2012, Mutinda Boniface - boniface.info@gmail.com
 *	
 * 		Date: Sun March / 08 / 2012 08:11 A.M
 ******* ---------------------------------------------------------------------- *******
 *
 ***************************************************************************************
*/

(function(){
	var document = window.document;
	trim = String.prototype.trim;
	
	var kScriptor = {	
		version: "1.1.2",
		build: "112",
		date:"Sun March / 08 / 2012 08:11 A.M",
		developer: "Mutinda Boniface",
				
		_helper: null,
		_browser: null,
				
		// kScriptor global elements for chaining purposes 
		_elements: [],
		_current_element: null,
		error : null,
		
		// required elem() selector array... (#, . ,!)
		/* # for element by id
		   . for element by classname
		   ! for element by tagname		   
		*/		
		_required_selectors		  :  ("#,.,!").split(','),
		_required_selector_length : 0,
		_found_selector_index 	  : 0,
		_id_selector_index		  : 0,
		_class_selector_index	  : 1,
		_tagname_selector_index	  : 2,
		
		// kScriptor initialize method
		initialize  : function(){
			// override global variables to hold other objects in the kScriptor namespace....
			this._helper = kScriptor.helper;
			// create a browser object 
			this._browser = kScriptor.browser;
		
			// initialize browser settings
			this._browser.init();
			
			// initialize helper properties
			this._helper.init();
			
			// required elems selectors length 
			this._required_selector_length = this._required_selectors.length;			
		},
		
		// main wrapper method for the library, required if you would like to work with DOM
		ready: function( callback ){		
			// make sure that DOM is successfully loaded..
			kScriptor.fn.ready( callback );
			
			// call kScriptor.initializer method 
			kScriptor.initialize();
		},
		
		// this is a selector method...... _ks.elem("#byid"), _ks.(".byclass"), .......
		elem: function( ){
			// if is a selector...determine by id,class, tagname	
			for(var i=0; i<arguments.length; i++){
				if(this._selector( arguments[i] )){
					this._determineSelector( arguments[i] );
					// set the element selector itself
					this._setSelector( this._found_selector_index );									
				}
			}
			// return the object for chaining purposes....	
			return this;
		},
		
		//  get elements by Id
		byid: function( ){
			var temporary_id_elements = [];	
			for(var i=0; i<arguments.length; i++){
				// am i actually working with strings?
				if(this._helper._isString(this._current_element)){					
					temporary_id_elements.push(document.getElementById(this._current_element));	
				}
			}
			this._elements =  temporary_id_elements;			
		},
		
		//  get elements by classname
		byclass:function( selector, type, parent ){	
			// gets all the elements inside a parent element or looks in the complete page
			var temporary_class_elements = [];
			// regExp t check whether the element has a class
			var pattern = new RegExp("(^| )" + selector + "( |$)"); // Regular expression to check if the elements have the class
            // Look for the elements by tagName with the condition of we can chose the parent,select one specific tag or all of them
			var e = (parent || document).getElementsByTagName(type || '*')  
			for(var i=0;i < e.length;i++){
				if(pattern.test(e[i].className)){// if the elements has the className then...
						temporary_class_elements.push(e[i]); // Add the element to temporary_class_elements
				}
			}	
			this._elements =  temporary_class_elements;	
		},
		
		//  get elements by tagName
		byTagName:function(){
			var temporary_tag_names = [];
			for(var i=0; i<arguments.length; i++){
				// am i working with strings?
				if(this._helper._isString(arguments[i])){
					var tags_length = document.getElementsByTagName(arguments[i]).length;
					for(var j=0; j<tags_length; j++){
						temporary_tag_names.push(document.getElementsByTagName(arguments[i][j]));
					}					
				}
			}
			this._elements = temporary_tag_names;
		},
		
		// function that receives the elem( parameters ) and determines the kind of element selector
		//  byid, byclass, bytag,,,,,,,
		_selector: function( options ){
			return kScriptor.helper._isString(options)?
				this._helper.trim( options ).length !==0? true: 		// if string, length==0?
					false:
			false;
		},
		
		// extract the first xter to find out whether its by id, class, tag
		_determineSelector: function( options ){
			// update the _current_element holder
			this._current_element = this._helper.trim(options);		
			var selector_determinant = this._current_element.charAt(0);			
			var result = false;
			
			for(var i=0; i<this._required_selector_length; i++){
				result  = selector_determinant===this._required_selectors[i]?true:false;
				if(result)	{this._found_selector_index = i;	break;}
				else {continue;}
			}			
		},
		
		_setSelector : function( selector_index ){
			// first remove the leading selector xters .i.e. '.' or '#', or '!'
			this._updateCurrentElement();
			
			// for element by id ..... selector_index = this._id_selector_index
			switch( selector_index ){
				case this._id_selector_index:
					this.byid(this._current_element);  break;
				case this._class_selector_index:
					this.byclass(this._current_element);  break;
				case this._tagname_selector_index:
					this.byTagName( this._current_element );  break;	
				default:	
					this.error = "Incorrect selectors specified... use #id_name, .class_name, !tagname";	break;
			}			
		},
		
		// this method removes the leading '.', '#' or '!'		
		_updateCurrentElement: function(){
			var element_length = this._current_element.length;
			this._current_element = this._current_element.substring(1,element_length);
		},
		
		addClass : function( class_name ){
			for(var i=0; i<this._elements.length; i++){
				this._elements[i].className+=''+class_name;
			}
			// for chaining purposes.....
			return this;
		},		
		
		/* ---------------------- events --------------------------------- */
		bind:function( event,callback ){ kScriptor.events.bind(event,callback) },
		submit:function(){},
		click:function(){},
		over:function(){},
		
		/*----------------------- @end events --------------------------- */
		// add an HTML content to an element chained ......
		html : function( text ){
			for(var i=0; i< this._elements.length; i++){
				this._elements[i].innerHTML = text;
			}
		},
		
		// extract an html object value.....		
		val: function( ){
			// assume a default value extract...e.g. for textboxes
			for(var i=0; i< this._elements.length; i++){
				return this._elements[i].value;
			}
		},
		
		/* ====== ajax =================== */				
		kajax: function( parameters ){
			kScriptor.ajax.init( parameters );
		},
		
		css : function( objectStyles){
			for( var i=0; i<this._elements.length; i++ ){
				for( css_style in objectStyles ){
					this._elements[i].style[css_style] = objectStyles[css_style];
				}
			}
			return this;
		},
		
		// form validate kscriptor method
		/* params:
			formname,
			array_of_fields,
			test cases,
			success callback function......
		*/
		validate: function( options ){
			// do i have any form defined???
			options.form ? kScriptor.kValidator.init( options ): alert( "No form defined ");
		},
		
		// form validation rules definition
		// escape sequence based on John Resign [jQuery founder] advanced javascript book.....
		
		checkMail: function( email_value ){						
			var emailRegExp =  /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i;
			var trimmedEmail = this._helper.trim( email_value );
			// make sure that there is an email address supplied....
			return !trimmedEmail || /^[a-z0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/i.test( trimmedEmail );
		}	
	}
	
	/* ----------------------- events implementations --------------------------------- */
	kScriptor.events = kScriptor.prototype= {		
		parent: kScriptor,
		bind: function(event, callback){	
			var trimmed_event = this.parent._helper.trim(event);
			// am i working with strings?						
			this.parent._helper._isString(trimmed_event)==true?
				// am i blank:
				trimmed_event=='' || trimmed_event==null?this.error = "on "+trimmed_event+" Could not be binded ":
					// add my events man
					this._registerEvent(trimmed_event, callback):						
			this.error = "on "+trimmed_event+" Could not be binded";
		},
		
		// form submit 
		submit:function(){
		},

		_registerEvent: function(event, callback){
			// if the first object i.e. window used addEventListener
			if(this.parent._elements[0].addEventListener){
				for(var i=0; i<this.parent._elements.length; i++){
					this.parent._elements[i].addEventListener(event, callback, false);
				}
			}						
			if(this.parent._elements[0].attachEvent){
				for(var i=0; i<this.parent._elements.length; i++){
					this.parent._elements[i].attachEvent("on"+event, callback);
				}
			}
		}
	}
	
	/* ---------------------- @end events  implementation --------------------------------- */
	
	// kScriptor helper object.....	
	kScriptor.helper = kScriptor.prototype = {	
		// helper initialization called after the DOM is loaded
		self: kScriptor.helper,
		parent: kScriptor,		
		
		init : function(){	
			leftTrim = /^\s+/;
			rightTrim = /\s+$/;			
		},
		
		trim : function( string_options ){
			if( string_options && string_options!='undefined' ){
				return string_options.replace(self.leftTrim,"").replace(self.rightTrim,"");
			}else{ return null}
			return this;
		},
		/*
		var name = "Mutinda boniface";				-- returns string
		var name = new String("Mutinda Boniface");	-- returns object [ Be careful ]
		*/		
		_parType : function( par_element ){
			return Object.prototype.toString.call(par_element);
		},
		
		_isArray : function( par_element ){
			/*try duck typing --- not recommended
				if(par_element.push && par_element.slice && par_element.join){ return true }
			*/
			// recommended.....
			return Object.prototype.toString.call(par_element) === '[object Array]'? true: false;			
		},
		
		_isNumber : function( par_element ){			
			return Object.prototype.toString.call(par_element) === '[object Number]'? true: false;	
		},
		
		_isString : function( par_element ){
			return Object.prototype.toString.call(par_element) === '[object String]'? true: false;	
		},
		
		_isFloat  : function( par_element ){
			// Object.prototype.toString.call(par_element) === '[object Number]'? true: false;	
		},
		
		_isHTMLobject : function( par_element){
			// html objects are in this format .... ['object HTMLDivElement']...
			// starts with object then followed by HTML and the element name...
			// get a substring from 0 - 12:   [object HTML
			// force it to act as a string--typecast 
			var object_in_string = new String(Object.prototype.toString.call(par_element));
			// return object_in_string.substring(0,12) === '[object HTML'? true:false;
			return object_in_string.substring(0,12);
		},
		_stringToLower: function( par_value ){
			return this._isString(par_value)? par_value.toLowerCase() : par_value;
		},
		_stringToUpper: function( par_value ){
			return this._isString(par_value)? par_value.toUppercase() : par_value;
		}
	}
	
	// string handlers
	kScriptor.string = kScriptor.prototype = {
		charAt : function( index ){
			return 11;
		}
	}	
	
	// form validation object ..... helper methods
	kScriptor.kValidator = kScriptor.prototype = {
		
		version : "1.0.0",
		revision : "0.0",
		developer : "Mutinda Boniface",
		release_date: "14th June 2012 14:10pm",	

		finished_validation: false,
		
		// my rules regex 		
		ruleRegex :/^(.+)\[(.+)\]$/,
        numericRegex : /^[0-9]+$/,
        integerRegex : /^\-?[0-9]+$/,
        decimalRegex : /^\-?[0-9]*\.?[0-9]+$/,
        emailRegex : /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
        alphaRegex : /^[a-z]+$/i,
        alphaNumericRegex : /^[a-z0-9]+$/i,
        alphaDashRegex : /^[a-z0-9_-]+$/i,
        naturalRegex : /^[0-9]+$/i,
        naturalNoZeroRegex : /^[1-9][0-9]*$/i,
        ipRegex : /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        base64Regex : /[^a-zA-Z0-9\/\+=]/i,
		
		// library options...
		// overriden by the passed data
		form_name: null,
		form_fields : [],
		form_field_rules_required: "email,required,int,number,float,ip,min,max,decimal,alpha".split(","),
		form_field_rules_required_length: 0,
		form_errors : [],
		form_callback: null,
		validate_lib_errors : [],
		parent: kScriptor,
				
		message_hooks: {
			valid_ip : "_0 field should contain a valid ip address",
			valid_email: "_0 field should be a valid email address",
			valid_number: "_0 field should contain natural numbers",
			valid_alpha: "_0 field should contain alphabetical letters",
			valid_required: "_0 field is required ",
			valid_int : "_0 field should contain digits",
			valid_decimal: "_0 field should contain digits"
		},
			
		init: function( lib_settings ){
			// clear out the initial form erros
			this.form_errors = [];
			this.form_field_rules_required_length = this.form_field_rules_required.length;
			
			var fields_length = 0;
			var field_name = null;
			var field_rules = [];
			
			// do i have any callback function for the validate method???
			
			if( lib_settings.success && typeof lib_settings.success ==="function" ){ 
				this.form_callback = lib_settings.success;
			}
			
			// set up the form name...
			lib_settings.form ? 
				this.form_name = document.forms[lib_settings.form]:
					this.registerError( "lib"," no form defined");
					//alert("No form defined ");
			// go through each field perfoming validation according to the rules defined
			// do i have my form setup
			
			this.form_name.onsubmit = function(){
				if(kScriptor.kValidator.form_errors.length>0){
					return false
				}
				else{kScriptor.kValidator.form_name.submit};
			}
			
			if( this.form_name  && this.form_name!='undefined'){
				if( lib_settings.fields ){
					var temporary_field_rules = null;
					// am i working with fields got as an object??
					if( typeof lib_settings.fields =="object"){
						fields_length = lib_settings.fields.length; 
						// do i have any fields specified?
						if( fields_length>0 ){
							for( var i=0; i< fields_length; i++){
								field_name = this.parent._helper.trim(lib_settings.fields[i].name) ;
								temporary_field_rules = this.parent._helper.trim(lib_settings.fields[i].rules) ;
								if( field_name  && field_name !=""){
									if( this._elementExistsInForm( field_name )){	
										// do i have any rules defined for the current inputelement
										field_rules = this._elementRulesDefined( temporary_field_rules );
										this.doValidate( field_name, field_rules );
										
									}else{
										this.registerError( "lib", field_name+ " cannot be found in your form");
									}
								}else{ 
									this.registerError( "lib", " field name left blank form");
								}
							}
							this.finished_validation = true;
							this.startCallback();
							//alert( this._elementExistsInForm("email") );
						}else{
							this.registerError( "lib", "No fields defined for validation");
						}
					}else{
						this.registerError( "lib", "No fields defined for validation");
					}
				}else{ this.registerError( "lib", "No fields defined for validation"); return false;}
			}else{
				this.registerError( "lib", "Please setup your form name to continue.......");
				alert("Please setup your form name to continue.......");
			}			
		},
		
		// method to determine whether an htmlobject exists in the form
		_elementExistsInForm: function( element_name ){
			return null || this.form_name[element_name];
		},
		// method to determine whether there are any rules defined for the inputelement
		_elementRulesDefined: function( element_rules ){
			var temporary_rules = this.parent._helper.trim( element_rules );
			if( temporary_rules && temporary_rules !="" ){
				return this._splitFieldRules( temporary_rules );
			}
		},
		
		// creates an array of valid rules for the field and returns them as an array
		// parameters: string of rules....i.e. rules: "email, required, int,......"
		_splitFieldRules : function( string_rules ){
			var temporary_field_rules = new String(this.parent._helper.trim( string_rules )),
				temporary_field_rules_size = 0,
				// will hold only valid rules for the element
				new_field_rules = [];
			
			if( temporary_field_rules && temporary_field_rules !="" && temporary_field_rules.length !=0){
				
				var new_rules = temporary_field_rules.split(",");
				var rule_to_lower = null;
				temporary_field_rules_size = new_rules.length;
				
				// register each rule encountered...				
				for( var i=0 ; i< temporary_field_rules_size; i++){
					// make the rule to be a lowercase
					rule_to_lower = this.parent._helper._stringToLower( new_rules[i] );
					// if the rule valid, register it to the new_field_rules..
					this._isValidRule(rule_to_lower) ? 
						new_field_rules.push( rule_to_lower ): 
						// log this error...
						this.registerError( "lib", "Inccorrect rule defined .."+new_rules[i]);
					//console.log("rules name = "+new_rules[i]);
				}
			}
			return new_field_rules;
		},
		
		// determine whether the rule defined is actually valid....
		// found in the required array of default rules
		_isValidRule: function( string_rule ){
			var elementValid = false;
			for(var i=0; i<this.form_field_rules_required_length; i++){
				if( this.form_field_rules_required[i]== string_rule ){
					elementValid = true;
					break;
				}
			}
			return elementValid;
		},
		
		_registerFieldRule: function( field_rule ){
			field_rule ? field_rules.push( field_rule ): false;
		},
		
		_extractErrorMessage: function( field , rule){
			var rule_error_message = null,
				error_messages = this.message_hooks,
				rule_complete = "valid_"+this.parent._helper.trim(rule);
			
			rule_error_message = error_messages[rule_complete].replace( "_0", field.name );
			this._logFormError( rule_error_message );
			
		},
		_logFormError: function( error_decription ){
			this.form_errors.push( error_decription );
		},
		
		// method to log errors for the validator lib
		registerError : function( register_to, error_description ){
			if( (register_to && register_to !="undefined") && (error_description && error_description !="undefined") ){
				// determines the holder of the error,
				// holds, lib or validate values 
				var register_error_to = register_to.toLowercase;
				switch( register_error_to ){
					case "lib":
						this.validate_lib_errors.push( error_description );
						break;
					case "validate":
						this.form_errors.push( error_description );
						break;
					default: return false;
				}
			}
		},
		
		// form element validate depending on the rules defined
		// email,required,int,number,float,ip,min,max,decimal
		
		doValidate: function( field, field_rules ){
			if( field_rules && field_rules.length !=0 &&  field_rules!='undefined'){
				for( var j=0, rules_size = field_rules.length ; j<rules_size; j++){
					
					var validate_rule = field_rules[j]; // contains email, ip, required e.t.c
						// get the 1st leter from the rule..e.g. email, "e"-> "E"
						ready_to_call_f_char = validate_rule.substr( 0, 1).toUpperCase(),
						rule_callback_name = "is"+ready_to_call_f_char+validate_rule.substr( 1, validate_rule.length)
					
					switch( this.parent._helper.trim(field_rules[j]) ){
						case "email":
							this.isMail( this.form_name[field] )? false: 
								this._extractErrorMessage( this.form_name[field], "email" );								
							break;
						case "required":
							this.isRequired( this.form_name[field] ) ? false:
								this._extractErrorMessage( this.form_name[field], "required" );
							break;
						case "ip":
							this.isIp( this.form_name[field])? false:
								this._extractErrorMessage( this.form_name[field], "ip" );
							break;
						case "decimal":
							this.isDecimal( this.form_name[field] ) ? false:
								this._extractErrorMessage( this.form_name[field], "decimal" );
							break;
						case "number":
							this.isNumber( this.form_name[field] ) ? false:
								this._extractErrorMessage( this.form_name[field], "number" );
							break;
						case "alpha":
							this.isAlpha( this.form_name[field] ) ? false:
								this._extractErrorMessage( this.form_name[field], "alpha" );
							break;
					}
				}
			}
		},
		startCallback: function(){
			this.finished_validation ? 
				this.form_callback( this.form_errors ): false;
		},
		
		isMail: function( _field_ ){
			// make sure that there is an email address supplied....
			return this.emailRegex.test( _field_.value );			
		},
		isUrl: function( _field_ ){
			
		},
		isPhone: function( _field_ ){
			
		},
		isInt: function( _field_ ){
			return this.integerRegex.test( _field_.value);
		},
		isAlpha: function( _field_){
			return this.alphaRegex.test( _field_.value); 
		},
		isIp: function( _field_ ){
			return this.ipRegex.test( _field_.value);
		},
		isDecimal: function( _field_ ){
			return this.decimalRegex.test( _field_.value);
		},
		isNumber : function( _field_ ){
			return this.naturalRegex.test( _field_.value); 
		},
		
		isRequired: function( _field_ ){
			if( _field_ && _field_ !='undefined'){
				var new_field_value = _field_.value ;	
				var new_filed_value_size = new_field_value? this.parent._helper.trim(new_field_value).length : 0;
				return new_filed_value_size<=0 ? false: true;
			}
		},
		
		_errorMessages: function(){
			
		}
		
	}
	
	// kScriptor.browser implementation
	kScriptor.browser = kScriptor.prototype = {
		init  : function(){
			// reqExpressions for browsers...
			
			// Useragent RegExp
			rwebkit = /(webkit)[ \/]([\w.]+)/;
			ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/;
			rmsie = /(msie) ([\w.]+)/;
			rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;
			
			userAgent = navigator.userAgent;			
		},
		
		agentMatch : function(){			
		}
	}
	
	// ajax object handler
	kScriptor.ajax = kScriptor.prototype = {
		constructor: kScriptor,
		init: function( options ){
			alert(options.Type);
		}
	}
	
	// kScriptor initializer function, dom successfully loaded
	kScriptor.fn = kScriptor.prototype = {
		constructor: kScriptor,
		ready: function( callback ){
		
			window.addEventListener?
				// event handlers for mozilla, webkit, opera
				document.addEventListener("DOMContentLoaded", callback, false):				
				// event handle for IE
				window.attachEvent("onload", callback)							
		},
		
		bindReady:function(){						
		},
		
		// cleanup functions for the document ready function 
		cleanup: function(){			
			if(document.addEventListener){
				// before detaching.... make the callback function execute.....
				DOMContentLoaded = function(){
					document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false)
				}
			}else if(document.attachEvent){
				DOMContentLoaded = function(){
					document.readyState ==="complete"? 
						document.detachEvent("onreadystatechange", DOMContentLoaded, false):false;
						window.detachEvent("onload",DOMContentLoaded);
				}
			}
		}
	}	
	
	// PUBLIC FUNCTIONS .... not in the kScriptor library	
	trim = trim? function(text) {
		//return text== null? "": trim.call(text);
	}:function(text){
		constructor = kScriptor.helper;
		//return text==null? "": text.toString.replace(kScriptor.helper.init.leftTrim,"").replace(kScriptor.helper.init.rightTrim,"");
	}
	
	// finishing kScriptor,,,, allow usage by _ks.method_name()
	if(!window._ks){
		window._ks = kScriptor;}
}());