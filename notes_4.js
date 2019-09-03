//This capter continues the discussion of functions by adding the function parameters 'this' and 'arguments'
//These are silently passed to functions and can be accessed just like any other explicitly named functions parameter within the
//function body.
//Function invocation -- the context by with the function is called -- is very important when dealing with 'this' and 'arguments'
//This and Arguments are implicit function parameters, meaning they are always passed into the body of the function automatically
//when the function is invoked. 
function Whatever(param1, param2){
    do stuff here; 
}
//is actually implicitly like.
function Whatever (param1, param2, this, arguments){
    do stuff here; 
}

//Arguments is a collection of all arguments passed into a function. It's useful because it allows us to access all arguments
//regardless of if the matching parameter is initially defined. This is more common in legacy code as 'rest' paramaters
// (...Remainingargs) has largely taken on this role.
//the Arguments object has a property named 'length' that indicates the exact number of arguments in array notation.
function Whatever(a,b,c){...} //this function declaration defines 3 parameters -- a,b and c. 
Whatever(1,2,3,4,5); //when the function is invoked however, it is given 5 arguments instead of 3.
//the arguments.length property within the function would tell us 0-4 meaning 5 arguments where passed, and all 5 are accessible.
a === 1; //true
c === 3; //true
arguments[4] === 5 //also true. 
//it is NOT accurate to call the arguments parameter an array, as common array methods -- like 'sort', do not work.
//rest parameters like ...Remainingargs IS a real array.
function sum(){ //here we are constructing a function to add numbers together, but we havent defined any parameters
    var sum = 0;    //we initialize a new variable called 'sum' and set it to be 0 as default.
    for (var i = 0; i < arguments.length; i++){ //we use a for loop to iterate through all passed in arguments
        sum += arguments[i]; //and access individual items through index notation
    }
    return sum;
}
sum(1,5,8,10); //24
sum(2,5); //7
sum(1,2,3,4,5,6,7,8,9,10); //55
//we can also change the value of arguments by using the arguments parameter.
function whatever(a,b){
    arguments[0] = 5;   //here we have specifically declared what the first argument will be.
}
whatever(1,2);  //so even though we have passed in 1 as the first argument, the function will still treat it as 5.
//this concept can be confusing so with the release of ES5 the 'use strict' mode disables this ability.
"use strict"
function whatever(a,b){
    arguments[0] = 5;   //in this example, argument[0] will change to 5, but the parameter 'a' will NOT. 
}

//when a function is called an implicit parameter called 'this' is passed in. 
//the 'this' parameter is a vital ingredient in object-oriented Javascript, and refers to an object that is 
//associated with the function INVOCATION. For this reason it's often referred to as the 'function context'
//Invoking functions.
//A function can be invoked in 4 ways;
whatever();     //as a function
yeah.whatever();    //as a method
new whatever();     //as a constructor
yeah.call(whatever);  yeah.apply(whatever);    //via the functions 'call' or 'apply' method.

//when a function is invoked as a function the value of 'this' will be the Window object in non-strict, and undefined in strict.
function whatever();{
    return this;        //'this' = Window or undefined
}
//when we invoke a function as a property of an object (called a method), the value of 'this' will reference the object the method is called from.
var yeah = {
    whatever: function(){
        return this;    //creates an object with a property that is a function.
    }    
};
yeah.whatever();    //'this' = the object 'yeah'
//when we use a function as a constructor by using the 'new' keyword, an empty object instance is created and passed to the function as it's functional context, or 'this'.
function constructorfunction(){
    this.whatever = function(){     //here we set up a function to be used as a constructor, that will contain a method that returns the value of 'this'.
        return this;
    };
}
var constructedFunction1 = new constructorfunction(); // 'this' = constructedFunction1
var constructedFunction2 = new constructorfunction(); // 'this' = constructedFunction2

//when a function has within its body a return value of its own, when called as a constructor the new object will ignore the returned value. 
function constructorfunction(){
    this.whatever = function(){    
        return true;
    };
    return 1;       //here we've appended the previous constructorfunction to also return the primitive value 1.
}

constructorfunction(); //1 will be returned as normal when called as a normal function
var constructedFunction3 = new constructorfunction(); //1 will not be returned but instead a new object called constructedFunction3 is returned. 
//now for a tricky exception...
var randomObject = {
    property1: false;       //creates an object with a known property
};

function constructorfunction(){
    this.property1 = true;      //creates a constructor function that returns the randomObject even though it sets the this.property1 value to 'true'
    return randomObject;
}

constructedFunction4 = new constructorfunction(); // this new constructedFunction4 object will have a property1 vaue of 'false' instead of 'true'. 

//in summary: if the constructor returns an object, that object will become the value of the 'new' expression instead of the newly created object passed as 'this'.
//            if the constructor returns a non-object, the returned value will be ignored and the newly created object passed as 'this' will be returned. 

//its possible to explicitly set the functional context of 'this' to whatever we want, the reason you would want to do this is related to a common issue 
//when dealing with event handling. When an event handler is called, like the 'click' event, the function context is set to the <element> that is bound to the event.
<button id="test">Click Me!</button> //imagine we have a button that we want to track with a click event whether the button has been clicked or not.
function Button(){      //we build a constructor function that will retain the state of each instantiation. 
    this.clicked = false;   //we initialize the button as 'not having been clicked' by setting the property 'clicked' to false. 
    this.click = function(){    //now we write a method for the new object to bind to the event handler
        this.clicked = true;
    };
}
var button = new Button();  // creates a single instance of the Button object through a constructor function now bound to the variable 'button'
var elem = document.getElementById("test"); //grabs the HTML button element created above and sets it to the variable 'elem'
elem.addEventListener('click', button.click); //binds an event listener to the var 'elem' that listens for a 'click' event and then runs the button.click method.
//the above code would fail to record the click event on the button object because the 'this' context is bound to <button> and not the newly created button object.
//had we invoked the function as a method of the button object (button.click();) then it would have worked correctly but since the browser defines the functional 
//context of the event as the target element of the event (<button>) a visual representation of what happened follows:
function Button(){      
    button.clicked = false;   
    button.click = function(){    
        elem.clicked = true;  //so the elem variable is updated as being clicked instead of the button variable.
    };
}
//Javascript provides a means for us to invoke a function and to specify any object we want as the context -- we do this through the 'apply' and 'call' methods.
//To invoke a function using the 'apply' method, two arguments are passed -- the object to be used as the context, and an array representing the arguments used.
//the 'call' method is used in a simlar way except arguments are passed in the argument list rather than as an array.

function sum(){     //re-using the sum example from above with the addition of setting the property 'sum' to the function context to test 'call' and 'apply'
    var sum = 0;   
    for (var i = 0; i < arguments.length; i++){ 
        sum += arguments[i]; 
    }
    this.sum = sum;     //this line of code creates a new property called 'sum' within the function context and sets it to the combined total of the arguments. 
}

var testObject1 = {};
var testObject2 = {};   //we instantiate two empty objects to be used with the test. 

sum.apply(testObject1, [1,2,3,4]); //testObject1.sum now equals 10. 
sum.call(testObject2, 5,6,7,8); //testObject2.sum now equals 26.

//all arrays have a built in method called 'forEach' that invokes a callback against each element in an array. 
//this style is preferred over the traditional 'for' statement in functional programming and offers better organizational benefits and code re-use.
//for this kind of iteration function (the 'forEach'), we *could* pass each element of the array as a parameter to the call back, but most make the
//current element the functional context of the callback. 
//we'll demonstrate this by building our own simplified forEach function.
function forEach1(array, callback){  //we create a function called 'forEach1' and pass it an array and a callback as arguments.
    for (var i = 0; i < array.length; i++){ //we loop over each element within the array
        callback.call(array[i], i); //for each element we invoke the callback function using that specific element as the context and its index as the argument
    }
}

var testArray = [       //we instantiate an array called 'testArray' that contains 3 objects each with a specific property.
    {property: "value1"},
    {property: "value2"},
    {property: "value3"}
];

forEach1(testArray, function(index){    //here we both call our forEach1 iterator function and define our callback to take the specific iteration(index) and log it.
console.log("This functional context has a property value of"+this.property);
})

//besides allowing a more elegant way to create functions other than standard expressions or declarations; arrow functions (or 'anonymous' functions) have
//one feature that makes them particularly useful as callback functions -- they do not have their own 'this' value. 
//Instead, they retain the value of the 'this' parameter at the time of their definition.
//revisiting the code block from above with the 'click' event handler:
<button id="test">Click Me!</button>
function Button(){
    this.clicked = false;
    this.click = ()=>{  //the only change, using an arrow function instead of a function expression.
        this.clicked = true;
    };
}

var button = new Button();
var elem = document.getElementById('test');
elem.addEventListener('click', button.click);
//In this newly revised code, the functional context of the click method will always be the newly created object of 'button' because arrow functions dont have a 'this'
//of their own.
//one special caveat to this is when using an arrow function with object literals in global scope. Since the arrow functions picks up it's 'this' from the moment it 
//is defined, it will inherit the Window object as its context when defined in the global scope.

//in addition to the 'call' and 'apply' methods that every function has built-in; there is another method called 'bind' that in short creates a new function.
//this new function has the same body, but its context is ALWAYS bound to a certain object regardless of its invocation. 
<button id="test">Click Me!</button>
function Button(){
    this.clicked = false;
    this.click = function() {  
        this.clicked = true;
    };
}

var button = new Button();
var elem = document.getElementById('test');
elem.addEventListener('click', button.click.bind(button)); //The only addition being the bind method. The context of the click method now will always be the button
//since we have bound the new function to the button object by passing it in as an argument. It is important to remember that this bound function is technically 
//a separate function from the original. 
