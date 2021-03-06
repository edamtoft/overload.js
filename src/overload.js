(function () {
  'use strict';
  
  // Processes overloads for a set of arguments. Should be called as
  // via overload(arguments). You can pass it an array of arguments, but just using
  // the built in arguments object is the intended use.
  var Overload = function (args, expectedType) {
    var _overload = this;
    var result;
    var hasResult = false;
    
    if (!expectedType) {
      expectedType = 'ANY';
    }
    
    // Instructs function to expect a particular return type, regardless of which
    // overload is called. Default is any. Can alse be provided through the constructor.
    this.expect = function (expected) {
      expectedType = expected;
    };
    
    // When...do functions describle the the conditions for overloads.
    // Example: .when(String, String).do(function(s1, s2){...}) 
    this.when = function () {
            
      var _when = this;
      var types = [];
      var lastAsArray = false;
      
      for (var i in arguments) {
        if (Array.isArray(arguments[i])) {
          types.push(arguments[i][0]);
          lastAsArray = true;
        } else {
          types.push(arguments[i]);
        }
      }

      
      // The function to call if the when function's types are met. Will pass in the
      // original arguments and be called in the context of the overload statement.
      this.do = function (callback) {
        if (hasResult) return _overload;

        if (matchTypes(types, args, lastAsArray)) {
          
          var argArray = [];
          var paramArray = [];
          
          for (var i in args) {
            if (lastAsArray && i >= types.length -1) {
              paramArray.push(args[i]);
            } else {
              argArray.push(args[i]);
            }
          }
          
          if (paramArray.length > 0) {
            argArray.push(paramArray);
          }
          
          result = callback.apply(args.caller, argArray);
          hasResult = true;
        }

        return _overload;
      };

      return _when;
    };
    
    // Function called if no overload has been found..
    this.otherwise = function (callback) {
      if (hasResult) return _overload;

      result = callback.apply(args.caller, args);
      hasResult = true;
      return _overload;
    };
    
    // Returns the result of the matching overload.
    this.result = function () {
      if (!hasResult) {
        throw new Error('No overload matching the supplied parameters: ' + args);
      }
      if (!matchType(result, expectedType)) {
        throw new TypeError('Unexpected type of return: ' + typeof result);
      }
      return result;
    };

    function matchTypes(types, test, extend) {
      if (!extend && types.length !== test.length) {
        return false;
      }
      
      if (types.length > test.length) {
        return false;
      }

      for (var i in test) {

        if (extend && i >= types.length) {
          if (!matchType(test[i], types[types.length - 1])) {
            return false;
          }
        } else {
          if (!matchType(test[i], types[i])) {
            return false;
          }
        }
      }

      return true;
    }
    
    function matchType(obj, typ) {
      if (typeof typ === 'string' && 
        typ.toUpperCase() === 'ANY') {
        return true;
      }
      if (typeof typ === 'function' && 
        (obj.constructor === typ || obj instanceof typ)) {
        return true;
      }
      return false;
    }
  };

  function overload(args, expectedType) {
    return new Overload(args, expectedType);
  }

  if (typeof window !== 'undefined') {
    window.overload = overload;
  } else {
    module.exports = overload;
  }

})();