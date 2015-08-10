# overload.js
Overload-like type-based functionality for javascript

## Overview
Overload allows you to specify different functionality for a method based on the types which are supplied. For example, you could have one public method which operated differently based on whether it is called with a string, two string, or a number.

In a strongly typed language, you can specify the following:
```csharp
string myFunction(string s) {
    return "I'm a string";
}

string myFunction(int i) {
    return "I'm a number;
}
```

This a difficult to do in javascript without a lot of messy "typeof" statements, and handling arbitrary numbers of arguments makes this even harder. Here's how you would get the same functionality as the above example with overload.js:

```javascript
function myFunction() {
    return overload(arguments)
    
    .when(String).do(function (str) {
        return "I'm a string";
    })
    
    .when(Number).do(function (num) {
        return "I'm a number";
    })
    
    .result();
}
```

You can use the constructors of any object type including custom object you create:

```javascript
var MyObj = function(){};

function myFunction() {
    return overload(arguments)
    
    .when(MyObj).do(function (myObj) {
        return "I'm a custom object";
    })
    
    .result();

}

var myObjInstance = new MyObj();

console.log(myFunction(myObjInstance)); // "I'm a custom object"
```

The benefit of this is that within your overload functions, you can safely assume the types of the arguments, and treat them accordingly.
By default, if a set of parameters that does not match any of your overloads has been called, the function will throw an error when you call for the result. You may specify a function to call otherwise using the .otherwise() function.

## Examples
### Simple Overloads
```javascript
function overloadedFunction() {
    return overload(arguments)
    
    .when(String).do(function (str) {
        return "I'm a single string" + str;
    })
    
    .when(String, String).do(function (str1, str2) {
        return "I'm a two strings: " + str1 + "," + str 2;
    })
    
    .when(String, Number).do(function (str, num) {
        return "I'm a string and a number:" + str + "," + num.toString();
    })
    
    .result();
}
```
### Any type
To allow any data type through, just pass the string "ANY" into the when statement.
```javascript
function overloadedFunction() {
    return overload(arguments)
    
    .when(String).do(function (str) {
        return s;
    })
    
    .when("ANY").do(function (item) {
        return item.toString();
    })

    .result();
}
```

### Overload with parameter array
Comparable to c# method(params string[] args). Passes array parameters to the called function as an array (as opposed to the original parameters); Must be the last parameter.
```javascript
function concat() {
    return overload(arguments)
    
    .when([String]).do(function (strings) {
        var s = '';
        for (var i in strings) {
            s += strings[i];
        }
        return s;
    })

    .result();
}

console.log(concat('string1','string2','string3')); // 'string1string2string3'
```

### Otherwise

Without this, the second call would throw an error. 

```javascript
function concat() {
    return overload(arguments)
    
    .when([String]).do(function (str) {
        var s = '';
        for (var i in arguments) {
            s += arguments[i];
        }
        return s;
    })
    
    .otherwise(function(){
        return 'Not all are strings';
    })

    .result();
}

console.log(concat('string1','string2','string3')); // 'string1string2string3'
console.log(concat('string1', 5 ,'string3')); // 'Not all are strings'
```

### Expect

You may specity a type to expect from the overloaded method, regardless of which overload is called. This can be done eitehr through the overload constructor, or through the .expect(Type) call.


```javascript
function myFunction() {
    return overload(arguments)
    
    .expect(String)
    
    .when(String).do(function (str) {
        return "I'm a string";
    })
    
    .when(Number).do(function (num) {
        return num; // Will throw error
    })
    
    .result();
}
```

This is the same as:

```javascript
function myFunction() {
    return overload(arguments, String)
    
    .when(String).do(function (str) {
        return "I'm a string";
    })
    
    .when(Number).do(function (num) {
        return num; // Will throw error
    })
    
    .result();
}
```