var overload = require('./../src/overload');

var TestObject = function(name){
  this.name = name;
};

function testFunction() {
  return overload(arguments, String)
  
  .when(String).do(function(s){
    return 'singleString: ' + s;
  })
  
  .when(String, String).do(function(s1, s2){
    return 'twoStrings: ' + s1 + ', ' + s2;
  })
  
  .when(String, Number).do(function(s, n){
    return 'stringAndNumber: ' + s + ', ' + n.toString();
  })
  
  .when(Number).do(function(n) {
    return 0;
  })
  
  .when(Number).lastAsParamArray().do(function(){
    var n = 0;
    for (var i = 0; i < arguments.length; i++) {
      n += arguments[i];
    }
    return n.toString();
  })
  
  .when(TestObject).do(function(t){
    return 'TestObject: ' + t.name;
  })
  
  .when(Object).do(function(t){
    return 'OtherObject';
  })
  
  .result();
}

module.exports = {
  
  'tests': function(test) {
    test.expect(8);
    
    test.deepEqual(testFunction('string'), 'singleString: string');
    test.deepEqual(testFunction('string','string'), 'twoStrings: string, string');
    test.deepEqual(testFunction('string', 1), 'stringAndNumber: string, 1');
    
    var testObject1 = new TestObject('testObject');
    var testObject2 = {};
    
    test.deepEqual(testFunction(testObject1), 'TestObject: testObject', 
      'Object should match overload for testObject.');
    test.deepEqual(testFunction(testObject2), 'OtherObject', 
      'Object should match overload for generic object.');
    
    test.throws(function(){
      testFunction('string', 1, 'string');
    }, 'No overload was provided, so we should see an error.');
    
    test.throws(function(){
      testFunction(1);
    }, 'Function returned a number, but we told it to expect a string, so we should get an error.');
    
    test.deepEqual(testFunction(1, 2, 3), '6', 'Should be treated as param array');
    
    test.done();
  }
}