(function(){
  'use strict';
  
  // Processes overloads for a set of arguments. Should be called as
  // via overload(arguments). You can pass it an array of arguments, but just using
  // the built in arguments object is the intended use.
  var Overload = function(args) {
    
    var _overload = this;
    var result;
    var hasResult = false;
    
    // When...do functions describle the the conditions for overloads.
    // Example: .when(String, String).do(function(s1, s2){...}) 
    this.when = function() {
      
      var _when = this;
      var types = arguments;
      var lastAsArray = false;
      
      // The function to call if the when function's types are met. Will pass in the
      // original arguments and be called in the context of the overload statement.
      this.do = function(callback) {
        if (hasResult) return _overload;
      
        if (matchTypes(types, args, lastAsArray)) {
          result = callback.apply(args.caller, args);
          hasResult = true;
        }
        
        return _overload;
      };
      
      // Treats the last param of the when statement as a param array.
      // Example: .when(String, Number).lastAsParamArray() would be called when
      // ('str', 1, 2, 3, 4, 5) was called. Passes through the original arguments, so
      // should be handled with the arguments object.
      // TODO: Pass as array?
      this.lastAsParamArray = function() {
        lastAsArray = true;
        return _when;
      };
      
      return _when;
    };
    
    // Function called if no overload has been found..
    this.otherwise = function(callback) {
      if (hasResult) return _overload;
      
      result = callback.apply(args.caller, args);
      hasResult = true;
      return _overload;
    };
    
    // Returns the result of the matching overload.
    this.result = function() {
      if (!hasResult) {
        throw new Error("No overload matching the supplied parameters.");
      }
      return result;
    };
    
    function matchTypes(types, test, extend) {    
      if (!extend && types.length !== test.length) {
        return false; 
      }
      
      for (var i in test) {
     
        if (extend && i >= types.length) {
          
          if (
            types[types.length - 1] !== 'ANY' && 
            test[i].constructor !== types[types.length - 1] && 
            !(typeof test[i] === 'object' && test[i] instanceof types[types.length - 1])) {
              
            return false;
          }
        } else if (
          types[i] !== 'ANY' && 
          test[i].constructor !== types[i] && 
          !(typeof test[i] === 'object' && test[i] instanceof types[i])) {
            
          return false;
        }
      }
      
      return true;
    }
  };
  
  function overload(args){
    return new Overload(args);
  }
  
  if (typeof window !== 'undefined') {
    window.overload = overload;
  } else {
    module.exports = overload;
  }
  
})();