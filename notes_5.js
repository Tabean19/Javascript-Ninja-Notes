//Closures
//a Closure allows a function to access and manipulate variables that are external to that function.

//Scope refers to the 'visibility' of identifiers in certain parts of a program.
//A declared function can be called at any later time, even AFTER the scope in which it was declared has gone away.
var outerVariable = "whatever"; //a variable declared with Global scope. 
function outerFunction(){
    //outerVariable is visible here. 
}
//outerVariable is available within the outerFunction because the outerVariable was declared in the Global scope, which is a closure that never goes away. 

var outerVariable = "whatever"; //global scope variable
var later;  //undefined variable 

function outerFunction(){
    var innerVariable = "stuff";    //declares a variable within the function scope -- this is not available outside the function.
    function innerFunction(){   //declares a 'nested' function within outerFunction's scope -- innerVariable is 'visible' here. 
        console.log(innerVariable);
        console.log(outerVariable);
    }
    later = innerFunction;  //creates a reference to the innerFunction through a global variable, 'later'.
}
outerFunction();    //runs outerFunction
later();    //runs innerFunction afterwards
//when we test this code we can see that the innerVariable will log 
//even though the scope in which the innerVariable was defined is gone (because the outerFunction already ran)
//this is only possible through Closures.
//when innerFunction is declared inside of outerFunction a closure is created that contains not only the function definition
//but ALSO the variables that are in scope at the time of its definition. 
//think of Closures as a 'saftey bubble' that stores the function definition and all in-scope variable at the time of definition for as long as the function lives.
//this is not free of overhead though as this information needs to be stored in the memory of the browser until it's clear that its no longer needed or the page unloads.

//Closures and Private Variables
//many programming languages use 'private variables', Javascript does not have native support for this but closures can work as a close approximation
function ConFun(){  //creates a constructor function
    var data = 0;   //sets the var data as 0
    this.getData = function(){  //adds a method called getData that returns the value of data
        return data;
    };
    this.add = function(){  //adds a method called add that increments the value of data
        data++;
    };
}

var Test1 = new ConFun();   //creates a new instance of the constructor called Test1
Test1.add();    //increments the value of data from 0 to 1
console.log(Test1.data);    //tries to log the value of data -- returns 'undefined' because 'data' refers to a variable not in global scope
console.log(Test1.getData());   //tries to log the value of data using getData method -- returns '1' because closures mean the method function 
                                //remains in-scope of 'data' variable

var Test2 = new ConFun();   //creates aother instance of ConFun
console.log(Test2.getData());   //logs the value of data with the getData method -- returns '0' proving each has their own unique data value. 

//since data was declared within the function as a function-level scope we are not able to see its value in the global scope. 
//using the concept of closures we are able 'see' the value of data becuase the method function 'getData' contains that value as part of its closure.
//this method of using functions as methods to reach out-of-scope variable is known as an 'accessor' method -- frequently called 'getters'
//its not fool-proof however, as you can still access the data variable outside of the object by assigning a new object method as the old object method:
var Test3 = {};
Test3.getData = Test2.getData //now Test3 has access to Test2's data!!!

//Closures and Callbacks
//often with callbacks we need to be able to access outside data.
<div id="box 1">First Box</div>     // creates a simple div with the ID of "box 1"
function animateIt(elementId){   //creates a function called animateIt that takes in an ID as an argument
    var elem = document.getElementById(elementId);   //sets a function level variable reference to the DOM object associated with the ID
    var tick = 0;       //sets a function level variable called tick and sets it to 0
    var timer = setInterval(function(){     //sets a variable called timer using the setInterval method and an anonymous function passed in as an argument.
        if (tick < 100) {   
            elem.style.left = elem.style.top = tick + "px";     //moves the div element a pixel for every "tick" count, increases "tick" count every pass.
            tick++;
        }
        else {      //stops the animation after 100 iterations. 
            clearInterval(timer);
            
        }
    }, 10); //the second argument of the setInterval method, causing the anonymous callback function to be called every 10ms.
}
animateIt("box 1"); //calls the function with "box 1" as the argument.

//this function only has one callback associated with it, and the callback needs to keep track of the variables "elem", "tick" and "timer" through closure.
//this function *could* work if the 3 variables were declared within the global scope -- but you run into problems when you try to do the following. 

<div id="box 2">Second Box</div>
animateIt("box 1");
animateIt("box 2");
//were the 3 variable declared in global scope, these functions would be trying to access the exact same variables and would break each other. 
//by declaring the variables within the function scope of animateIt, we create a closure around each instance of the function call meaning that each
//callback has essentially its own "private" variables within each closure to use. 

//Tracking code execution with execution contexts
//just as we have two different layers of code -- global code and function code -- we too have two different layers of execution contexts.
//NOTE: in chapter 4 we discussed 'function contexts', 'execution contexts' though similar in name are a completely different thing. 
//Global Execution Context - there is only one global exec context created when the javascript program starts
//Function Execution Context - there is a new function exec context created each time a function is invoked. 
//since JS has a single-threaded execution model, only one peice of code can be executed at a time, so the engine must keep track of not only the code that is executing
//but also the code that is waiting to be executed -- this is commonly referred to as a "call stack"
function callReport(param1){
    report(param1 + " whatever");   //creates a function that calls another function (report)
}

function report(message){   //creates a function that reports a message to the console.log function
    console.log(message);
}
callReport("yeah");    //two function calls from global code, returns "yeah whatever" and "sure whatever".
callReport("sure");
//when this code is ran the execution context behaves as follows:
//1. the Global Context is ran on page load, this will define "callReport" and "report" and then run "callReport("yeah")" and pauses.
//2. the engine now runs through the Function execution context of "callReport("yeah")" and then calls "report("yeah" + " whatever")" and pauses.
//3. the engine logs "yeah whatever" to the console and ends the execution of "report("yeah" + " whatever")", returning back to "callReport("yeah")".
//4. callReport("yeah") finishes executing and then the engine returns to global.
//5. the Global code runs callReport("sure") and the cycles starts again. 

//keeping track of identifiers with lexical environments
//lexical environments, also called "scope" is based on code nesting, which is when one block of code is contained within another. 
var person = "Travis"
function walk(){    //this function is nested in Global
    var action = "walking";
    function report (){     //this function is nested in walk();
        var reportNum = 3;
        for (var i = 0; i < reportNum; i++){    //this loop is nested in report();
            console.log(person + " " + action + " " + i);
        }
    }
    report();
}
walk(); 
//each of these code blocks gets an associated scope EVERY time it is evaluated.
//code blocks have access to variables defined higher up in nested hierarchy. Meaning the for loop has access to everything but the walk function only has access to Global
//so not only do execution context have to keep track of local variables, function declarations and parameters -- but also everthing within higher nested blocks too. 

//Understanding types of Javascript Variables
//JS has three different types of variable the var, which has always existed in JS and the new-since-ES6 variables let and const. 
//Const - can only be declared once, cannot be undefined upon creation and are used mainly for variables that should never be redefined. if a const is an array or object
//you are able to add new properties or array items only.
const constant1 = 5;
constant1 = 4; //you cannot do this.
const constant2 = {};
constant2.property1 = 4; //you can do this
const constant3 = [];
constant3.push = 3; //you can also do this.
//the different variables have different scope abilities
//Var - variables defined with var have their lexical environment (scope) as the closest functional or global scope, var variables ignore blocks. 
//let and const are block scoped variables - meaning they are only scoped within their closest block, function, loop or global context. Here is an example
function doStuff(){
    for(var i = 0; i < 10; i++){    //we have declared a variable "i" with var
        console.log(i); // i is accessible here within the for loop block
    }
    console.log(i); //but also here, outside of the for loop block because var is scoped to the nearest function - doStuff();
}
doStuff();
//compare with the following
function doStuff(){
    for(let i = 0; i < 10; i++){    //we have declared the variable "i" using let
        console.log(i);     //it is accessible here within the for loop block
    }
    console.log(i);     //it is NOT accessible here, because it is now out of scope. 
}
doStuff();

//calling functions before their declrations.
//In javascript you can call functions before they are defined only if they are defined within a function declaration. Function expressions and arrow functions do
//not work this way. 
funDec(); //this worked
funExp(); //undefined
funArrow(); //undefined
function funDec(){
    console.log("this worked"); 
}

var funExp = function(){
    console.log("this worked"); 
};

var funArrow = () => {
    console.log("this worked");
};
// overriding function identifiers
console.log(typeof(funDec)); //this will return "function" because the js code reads the declaration below FIRST before executing this line of code. 
var funDec = 3;
console.log(typeof(funDec)); //this will return "number" because we just reassigned funDec as 3.
function funDec() {}        //this line is read before any code is executed.
console.log(typeof(funDec)); //this will return "number" again, because the code ignores the declaration on the second pass. 

