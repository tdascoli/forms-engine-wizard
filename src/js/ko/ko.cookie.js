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
