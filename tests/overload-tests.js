var overload = require('./../src/overload');

var TestObject = function(name){
  this.name = name;
};

function testFunction() {
  return overload(arguments)
  
  .when(String).do(function(s){
    return 'singleString: ' + s;
  })
  
  .when(String, String).do(function(s1, s2){
    return 'twoStrings: ' + s1 + ', ' + s2;
  })
  
  .when(String, Number).do(function(s, n){
    return 'stringAndNumber: ' + s + ', ' + n.toString();
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
    test.expect(6);
    
    test.equal(testFunction('string'), 'singleString: string');
    test.equal(testFunction('string','string'), 'twoStrings: string, string');
    test.equal(testFunction('string', 1), 'stringAndNumber: string, 1');
    
    var testObject1 = new TestObject('testObject');
    var testObject2 = {};
    
    test.equal(testFunction(testObject1), 'TestObject: testObject');
    test.equal(testFunction(testObject2), 'OtherObject');
    
    test.throws(function(){
      testFunction('string', 1, 'string')
    });
    
    test.done();
  }
}